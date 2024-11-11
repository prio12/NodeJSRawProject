//scaffolding
const utilities = {};

utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }
  return output;
};

utilities.randomString = (strLength) => {
  let length = strLength;
  length = typeof strLength === "number" && strLength > 0 ? strLength : false;
  const possibleCharacters = "abcdefghijklmnopqrstuvwxyz1234567890";
  let output = "";
  for (i = 1; i <= length; i++) {
    const randomCharacter = possibleCharacters.charAt(
      Math.floor(Math.random() * possibleCharacters.length)
    );
    output += randomCharacter;
  }
  return output;
};
module.exports = utilities;
