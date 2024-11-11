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
handler._token.put = (requestProperties, callback) => {};
handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;
