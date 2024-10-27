//dependencies
const { sampleHandler } = require("./handler/routesHandlers/sampleHandler");
const { userHandler } = require("./handler/routesHandlers/userHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
};
module.exports = routes;
