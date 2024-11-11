//dependencies
const { sampleHandler } = require("./handler/routesHandlers/sampleHandler");
const { userHandler } = require("./handler/routesHandlers/userHandler");
const {tokenHandler} = require("./handler/routesHandlers/tokenHandler")

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token:tokenHandler,
};
module.exports = routes;
