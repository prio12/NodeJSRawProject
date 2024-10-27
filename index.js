//dependencies
const http = require("http");
const { handleReqRes } = require("./helper/handleReqRes");
const lib = require("./lib/data");
//scaffolding
const app = {};
//config
app.config = {
  port: 3000,
};

//will remove , it's for fs testing

// lib.delete("test", "second", (err) => {
//   console.log(err);
//   console.log("_____________________");
// });

//create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`server is running on port ${app.config.port}`);
  });
};
//handleReqRes
app.handleReqRes = handleReqRes;
//start server
app.createServer();
