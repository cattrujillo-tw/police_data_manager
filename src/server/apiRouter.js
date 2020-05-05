import { handleCaseIdParam } from "./handlers/paramHandler";
import { addRoutesToRouter } from "./apiRoutes";
import API_ROUTES from "./apiRoutes";
import app from "./server";

const jwtCheck = require("./handlers/jtwCheck");
const verifyUserInfo = require("./handlers/verifyUserNickname");
const authErrorHandler = require("./handlers/authErrorHandler");

const express = require("express");
const router = express.Router();

router.use(jwtCheck);
router.use(verifyUserInfo);
router.use(authErrorHandler);

router.param("caseId", handleCaseIdParam);

let clients = [];

const streamNotifications = (req, res, next) => {
  console.log("Request", req);

  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  // only set this header in local
  res.setHeader("Access-Control-Allow-Origin", "https://localhost");

  res.flushHeaders();

  // After client opens connection send all nests as string
  const data = `data: ${JSON.stringify("Made connection with client")}\n\n`;
  res.write(data);
  const clientEmail = req.nickname;
  const message = `${clientEmail} has subscribed to notifications.`;
  res.write(`data: ${JSON.stringify(message)} \n\n`);

  console.log("sent data from stream notifications");

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  //console.log("Clients", clients);

  // When client closes connection we update the clients list
  // avoiding the disconnected one
  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(c => c.id !== clientId);
  });
  //sendEventsToAll("updating my SSE after clients added")
};

// Iterate clients list and use write res object method to send new nest
function sendNotification(newNest) {
  clients.forEach(c => c.res.write(`data: ${JSON.stringify(newNest)}\n\n`));
}

router.get("/notifications", streamNotifications);

//Routes defined in API_ROUTES and below will require authentication
addRoutesToRouter(router, API_ROUTES);

module.exports = router;
