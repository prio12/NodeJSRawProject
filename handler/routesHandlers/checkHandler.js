//dependencies
const lib = require("../../lib/data");
const { parseJSON, randomString } = require("../../helper/utilities");
const tokenVerify = require("./tokenHandler");
//module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      error: "No route found",
    });
  }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["https", "http"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;
  let method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;
  let successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  let timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.timeOutSeconds
      : false;

  if (protocol && url && method && successCodes && timeOutSeconds) {
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    //lookup the user phone by reading token
    lib.read("tokens", token, (data, err1) => {
      console.log(err1);
      if (!err1 && data) {
        let tokenData = parseJSON(data);
        const userPhone = tokenData.phone;
        lib.read("users", userPhone, (userData, err2) => {
          if (!err2 && userData) {
            tokenVerify._token.verify(token, userPhone, (verifiedToken) => {
              if (verifiedToken) {
                let userObject = parseJSON(userData);
                let userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];
                //checking the checking length
                if (userChecks.length < 5) {
                  const checkId = randomString(20);
                  const checkObject = {
                    checkId,
                    phone: userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeOutSeconds,
                  };
                  //save the check object for a individual user in data/checks folder
                  lib.create("checks", checkId, checkObject, (err4) => {
                    if (!err4) {
                      userObject.checks = userChecks;
                      userObject.checks.push = checkId;
                      //update the existing userdata
                      lib.update("users", userPhone, userObject, (err5) => {
                        if (!err5) {
                          callback(200, userObject);
                        } else {
                          callback(500, {
                            error: "There was an error from server side!",
                          });
                        }
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: "user has already reached check limit! ",
                  });
                }
              } else {
                callback(403, {
                  error: "Unauthorized user ",
                });
              }
            });
          } else {
            callback(403, {
              error: "User not found",
            });
          }
        });
      } else {
        callback(401, {
          error: "Unauthorized user ",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};
handler._check.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    lib.read("checks", id, (data, err1) => {
      if (!err1 && data) {
        let token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;

        tokenVerify._token.verify(
          token,
          parseJSON(data).phone,
          (verifiedToken) => {
            if (verifiedToken) {
              callback(200, parseJSON(data));
            } else {
              callback(403, {
                error: "Unauthorized user!",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "There was a server side error!",
        });
      }
    });
  } else {
    callback(401, {
      error: "There was a problem in your request!",
    });
  }
};
handler._check.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["https", "http"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;
  let method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;
  let successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  let timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.timeOutSeconds
      : false;

  if (id) {
    if (protocol || url || method || successCodes || timeOutSeconds) {
      lib.read("checks",id, (data, err1) =>{
        if (!err1 && data) {
          let checkData = parseJSON(data);
          let token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;
            tokenVerify._token.verify(token,checkData.phone, (verifiedToken) =>{
              if (verifiedToken) {
                if (protocol) {
                  checkData.protocol = protocol
                }
                if (protocol) {
                  checkData.url = url
                }
                if (protocol) {
                  checkData.method = method
                }
                if (protocol) {
                  checkData.successCodes = successCodes
                }
                if (protocol) {
                  checkData.timeOutSeconds = timeOutSeconds
                }

                lib.update("checks",id, checkData, (err2) =>{
                  if(!err2) {
                    callback(200, checkData)
                  } else {
                    callback(500, {
                      error:"There was a problem in server side!"
                    })
                  }
                })
              } else {
                callback(403, {
                  error:"Authentication error !"
                })
              }
            })
        } else {
          callback(500,{
            error: "There was a problem in the server side!",
          })
        }
      })
    } else {
      callback(400, {
        error: "You must provide at least one field to update",
      });
    }
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};
handler._check.delete = (requestProperties, callback) => {};
module.exports = handler;
