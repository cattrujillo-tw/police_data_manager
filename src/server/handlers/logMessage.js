const asyncMiddleWare = require("../asyncMiddleware");

const logMessage = asyncMiddleWare(async (request, response, next) => {
  winston.info("Request:", request);
  response.status(200).send();
});

export default logMessage;
