//dependencies
const lib = require("../../lib/data");
const { parseJSON, randomString } = require("../../helper/utilities");

//scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};
handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    lib.read("users", phone, (data, error) => {
      let userData = { ...parseJSON(data) };
      console.log(userData);

      if (userData.password === password) {
        let tokenId = randomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone,
          tokenId,
          expires,
        };
        lib.create("tokens", tokenId, tokenObject, (error1) => {
          if (!error1) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: "There was a error in server side!",
            });
          }
        });
      } else {
        callback(400, {
          error: "Password is not valid!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You've problem in your request",
    });
  }
};
handler._token.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    lib.read("tokens", id, (data, err) => {
      if (!err && data) {
        const tokenData = { ...parseJSON(data) };
        callback(200, tokenData);
      } else {
        callback(404, {
          error: "404 : Not Found",
        });
      }
    });
  } else {
    callback(404, {
      error: "404 : Not Found if not found phone",
    });
  }
};
handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? true
      : false;

  if (id && extend) {
    lib.read("tokens", id, (data, error1) => {
      if (data && !error1) {
        let tokenData = parseJSON(data);
        //checking if the token expired
        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() * 60 * 60 * 100;
          //store the updated value
          lib.update("tokens", id, tokenData, (err3) => {
            if (!err3) {
              callback(200, tokenData);
            } else {
              callback(400, {
                error: "There was a problem while updating token data",
              });
            }
          });
        } else {
          callback(400, {
            error: "Token already expired",
          });
        }
      } else {
        callback(400, {
          error: error1,
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};
handler._token.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    lib.read("tokens", id, (data, error) => {
      if (!error && data) {
        lib.delete("tokens", id, (err) => {
          if (!err) {
            callback(200, {
              message: "Token was deleted successfully!",
            });
          } else {
            callback(500, {
              error: "There was a problem from server side!",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a problem in your request!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};

handler._token.verify = (id, phone, callback) => {
  lib.read("tokens", id, (data, error) => {
    let tokenData = parseJSON(data);
    if (!error && tokenData) {
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
