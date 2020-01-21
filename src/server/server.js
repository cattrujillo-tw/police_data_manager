import http from "http";
import https from "https";
import fs from "fs";

import {
  handleSigterm,
  refuseNewConnectionDuringShutdown
} from "./serverHelpers";
import * as webpush from "web-push";

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

app.use(function(req, res, next) {
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
        "'sha256-5As4+3YpY62+l38PsxCEkjB1R4YtyktBtRScTJ3fyLU='"
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

app.get("*", function(req, res) {
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

webpush.setVapidDetails(
  process.env.WEB_PUSH_CONTACT,
  process.env.REACT_APP_PUBLIC_VAPID_KEY,
  process.env.REACT_APP_PRIVATE_VAPID_KEY
);

app.post("/notifications/subscribe", (req, res) => {
  const subscription = req.body;

  console.log(subscription);

  const payload = JSON.stringify({
    title: "Hello!",
    body: "It works."
  });

  webpush
    .sendNotification(subscription, payload)
    .then(result => console.log(result))
    .catch(e => console.log(e.stack));

  res.status(200).json({ success: true });
});

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
