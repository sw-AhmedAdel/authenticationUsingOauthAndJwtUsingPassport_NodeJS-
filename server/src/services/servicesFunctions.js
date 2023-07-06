const generatePassword = require("generate-password");

const passwordOptions = {
  length: 12, // Length of the password
  numbers: true, // Include numbers
  symbols: true, // Include symbols
  uppercase: true, // Include uppercase letters
  excludeSimilarCharacters: true, // Exclude similar characters (e.g., 'i', 'l', '1', 'L')
};

function generatePasswordFun() {
  const password = generatePassword.generate(passwordOptions);
  return password;
}

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

function filterObj(body, ...array) {
  const filter = {};
  console.log(Object.keys(body));
  Object.keys(body).forEach((el) => {
    if (array.includes(el)) {
      filter[el] = body[el];
    }
  });
  return filter;
}

function checkPermissions(requestUser, resouceUserID) {
  if (requestUser.role === "guide") return true;
  else if (requestUser._id.toString() === resouceUserID._id.toString())
    return true;
  else return false;
}

module.exports = {
  catchAsync,
  filterObj,
  checkPermissions,
  generatePasswordFun,
};
