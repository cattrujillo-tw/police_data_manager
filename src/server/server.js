import http from "http";
import https from "https";
import fs from "fs";

import {
  handleSigterm,
  refuseNewConnectionDuringShutdown
} from "./serverHelpers";

const newRelic = require("newrelic");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const config = require("./config/config")[process.env.NODE_ENV];
const healthCheck = require("./handlers/healthCheck");
const errorHandler = require("./handlers/errorHandler");
const apiRouter = require("./apiRouter");
const featureToggleRouter = require("./featureToggleRouter");
const expressWinston = require("express-winston");
const winston = require("winston");
const cookieParser = require("cookie-parser");
//const cors = require('cors');

winston.configure({
  transports: [
    new winston.transports.Console({
      json: config.winston.json,
      colorize: true
    })
  ],
  level: config.winston.logLevel,
  colorize: true // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
});

const app = express();
// Set cors and bodyParser middlewares
//app.use(cors()); sd
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let clients = [];

const streamNotifications = (req, res, next) => {
  console.log("Request", req.body);

  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  // only set this header in local
  res.setHeader("Access-Control-Allow-Origin", "https://localhost");

  res.flushHeaders();

  // After client opens connection send all nests as string
  const data = `data: ${JSON.stringify("Made connection with client")}\n\n`;
  res.write(data);
  res.write("\n\n");

  console.log("sent data from stream notifications");

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  console.log("Clients", clients);

  // When client closes connection we update the clients list
  // avoiding the disconnected one
  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(c => c.id !== clientId);
  });
  //sendEventsToAll("updating my SSE after clients added")
};

// Iterate clients list and use write res object method to send new nest
function sendEventsToAll(newNest) {
  clients.forEach(c => c.res.write(`data: ${JSON.stringify(newNest)}\n\n`));
}

app.get("/notifications", streamNotifications);

app.use(function (req, res, next) {
  res.header("X-powered-by", "<3");
  next();
});
const twoYearsInSeconds = 63113852;
app.locals.shuttingDown = false;

app.use(refuseNewConnectionDuringShutdown(app));

app.use(
  helmet.hsts({
    maxAge: twoYearsInSeconds
  })
);

app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.noSniff());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      formAction: ["'none'"],
      defaultSrc: ["'none'"],
      baseUri: ["'none'"],
      connectSrc: config.contentSecurityPolicy.connectSrc,
      fontSrc: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      imgSrc: ["'self'", "data:"],
      scriptSrc: [
        "'self'",
        "https://maps.googleapis.com",
        "'sha256-GgRxrVOKNdB4LrRsVPDSbzvfdV4UqglmviH9GoBJ5jk='",
        "'sha256-5As4+3YpY62+l38PsxCEkjB1R4YtyktBtRScTJ3fyLU='",
        "'unsafe-eval'"
      ], //the sha represents the inline script generated by webpack
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://cdn.quilljs.com",
        "'unsafe-inline'"
      ]
    }
  })
);

const buildDirectory = path.join(__dirname, "../../build");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(buildDirectory));

app.get("/health-check", healthCheck);

app.use(featureToggleRouter);

app.use(
  expressWinston.logger({
    winstonInstance: winston,
    requestWhitelist: ["url", "method", "body", "originalUrl", "query"], //hide request headers that have auth token
    //all request whitelist options are: ['url', 'headers', 'method', 'httpVersion', 'originalUrl', 'query', 'body']
    bodyBlacklist: ""
  })
);

app.use("/api", apiRouter);

app.get("*", function (req, res) {
  res.sendFile(path.join(buildDirectory, "index.html"));
});

app.use(
  expressWinston.errorLogger({
    winstonInstance: winston,
    baseMeta: { trace: "See stack", memoryUsage: "" },
    requestWhitelist: ["url", "method", "originalUrl"]
    // hide request headers and body for brevity. keep in mind this line may be emailed to team in error alert,
    // so don't log sensitive data from request body or query
  })
);

app.use(errorHandler);

export let server;

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  const options = {
    key: fs.readFileSync("src/server.key"),
    cert: fs.readFileSync("src/server.crt")
  };
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

process.on("SIGTERM", () => {
  handleSigterm(app);
});

export default app;
