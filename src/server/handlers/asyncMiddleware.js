const Boom = require("boom");

const asyncMiddleware = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    console.log("ERROR: ", err);
    if (!err.isBoom) {
      return next(Boom.badImplementation(err));
    }
    next(err);
  }
};

module.exports = asyncMiddleware;
