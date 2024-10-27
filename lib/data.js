//dependencies
const fs = require("fs");
const path = require("path");
//scaffolding
const lib = {};

lib.basedir = path.join(__dirname, "../data");
lib.create = (dir, file, data, callback) => {
  const fullDir = path.join(lib.basedir, dir); // Full path to the directory
  const filePath = path.join(fullDir, `${file}.json`);
  fs.open(filePath, "wx", (error, fileDescriptor) => {
    if (!error && fileDescriptor) {
      //convert data to String
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, (err1) => {
        if (!err1) {
          fs.close(fileDescriptor, (err2) => {
            if (!err2) {
              callback(false);
            } else {
              callback(err2);
            }
          });
        } else {
          callback(err1);
        }
      });
    } else {
      callback(error);
    }
  });
};

lib.read = (dir, file, callback) => {
  const fullDir = path.join(lib.basedir, dir); // Full path to the directory
  const filePath = path.join(fullDir, `${file}.json`);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (!err && data) {
      callback(data);
    } else {
      callback(err);
    }
  });
};

lib.update = (dir, file, data, callback) => {
  const fullDir = path.join(lib.basedir, dir); // Full path to the directory
  const filePath = path.join(fullDir, `${file}.json`);
  //open file as a first step of updating
  fs.open(filePath, "r+", (error, fileDescriptor) => {
    if (!error && fileDescriptor) {
      //empty/truncate the file to write updated data
      fs.truncate(fileDescriptor, (err1) => {
        if (!err1) {
          const stringData = JSON.stringify(data);
          fs.writeFile(fileDescriptor, stringData, (err2) => {
            if (!err2) {
              fs.close(fileDescriptor, (err3) => {
                callback(err3);
              });
            } else {
              callback(err2);
            }
          });
        } else {
          callback(err1);
        }
      });
    } else {
      callback(error);
    }
  });
};

lib.delete = (dir, file, callback) => {
  const fullDir = path.join(lib.basedir, dir); // Full path to the directory
  const filePath = path.join(fullDir, `${file}.json`);
  fs.unlink(filePath, (err) =>{
    callback(err)
  })
};
module.exports = lib;
