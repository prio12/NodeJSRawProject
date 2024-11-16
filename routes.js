//dependencies
const { sampleHandler } = require("./handler/routesHandlers/sampleHandler");
const { userHandler } = require("./handler/routesHandlers/userHandler");
const {tokenHandler} = require("./handler/routesHandlers/tokenHandler")
const {checkHandler} = require("./handler/routesHandlers/checkHandler")

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token:tokenHandler,
  check: checkHandler,
};
module.exports = routes;
