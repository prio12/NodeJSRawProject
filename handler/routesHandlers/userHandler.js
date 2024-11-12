//dependencies
const lib = require("../../lib/data");
const { parseJSON } = require("../../helper/utilities");
const tokenVerify = require("./tokenHandler");
//module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};
handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
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
  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean"
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && password && phone && tosAgreement) {
    //make sure the user doesn't exist already!
    lib.read("users", phone, (err) => {
      if (err) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password,
          tosAgreement,
        };
        lib.create("users", phone, userObject, (err) => {
          if (!err) {
            callback(200, {
              message: "User created successfully!",
            });
          } else {
            callback(500, {
              error: "Could not create user!",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was an error on server side!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};
handler._users.get = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
  if (phone) {
    //verify with token before look up the user

    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;
    tokenVerify._token.verify(token, phone, (verifiedToken) => {
      if (verifiedToken) {
        lib.read("users", phone, (data, err) => {
          if (!err && data) {
            const user = { ...parseJSON(data) };
            delete user.password;
            callback(200, user);
          } else {
            callback(404, {
              error: "404 : Not Found",
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
    callback(404, {
      error: "404 : Not Found if not found phone",
    });
  }
};
handler._users.put = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
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

  if (phone) {
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;
    tokenVerify._token.verify(token, phone, (verifiedToken) => {
      if (verifiedToken) {
        if (firstName || lastName || password) {
          lib.read("users", phone, (data, err) => {
            const userData = { ...parseJSON(data) };
            if (!err && data) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = password;
              }
              //update the database with updated data
              lib.update("users", phone, userData, (err, data) => {
                if (!err) {
                  callback(400, {
                    message: "Profile updated successfully!",
                  });
                } else {
                  callback(400, {
                    error: "There's a problem in your request!",
                  });
                }
              });
            } else {
              callback(400, {
                error: "There's a problem in your request!",
              });
            }
          });
        }
      } else {
        callback(401, {
          error: "Unauthorized user ",
        });
      }
    });
  } else {
    callback(400, {
      error: "There's a problem in your request!",
    });
  }
};
handler._users.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
  if (phone) {
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;
    tokenVerify._token.verify(token, phone, (verifiedToken) => {
      if (verifiedToken) {
        lib.read("users", phone, (data, error) => {
          if (!error && data) {
            lib.delete("users", phone, (err) => {
              if (!err) {
                callback(200, {
                  message: "User was deleted successfully!",
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
module.exports = handler;
