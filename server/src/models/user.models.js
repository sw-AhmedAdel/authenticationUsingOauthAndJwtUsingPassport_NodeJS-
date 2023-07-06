const User = require("./user.mongo");
const { generatePasswordFun } = require("../services/servicesFunctions");

async function CreateUser(user) {
  const newUser = await User(user);
  await newUser.save();

  /*if (!newUser.singUsingGoogle) {
    return newUser;
  }*/

  return newUser;
}

async function findOnerUser(filter) {
  const user = await User.findOne(filter); //.select("+password"); to make password display just works with findone not find all
  return user;
}

async function GetAllUsers() {
  return await User.find({}, { __v: 0 });
}

async function UpdateMe(id, filter) {
  const user = await User.findByIdAndUpdate(id, filter, {
    new: true,
    runValidators: true,
  });
  return user;
}

function extractUserInfo(body) {
  const user = {
    googleId: generatePasswordFun(),
    firstName: body.firstName,
    lastName: body.firstName,
    password: body.password,
    email: body.email,
  };
  return user;
}

module.exports = {
  CreateUser,
  findOnerUser,
  GetAllUsers,
  UpdateMe,
  extractUserInfo,
};
