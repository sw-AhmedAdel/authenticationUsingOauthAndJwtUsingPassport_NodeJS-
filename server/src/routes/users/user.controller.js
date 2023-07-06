const {
  GetAllUsers,
  UpdateMe,
  findOnerUser,
  extractUserInfo,
  CreateUser,
} = require("../../models/user.models");

const { filterObj } = require("../../services/servicesFunctions");
const appError = require("../../services/classError.global.express");

async function httpSigUp(req, res, next) {
  const user = extractUserInfo(req.body);
  const newUser = await CreateUser(user);
  const token = newUser.generateAuthToken();
  return res.status(201).json({
    token,
    user: newUser,
  });
}

async function httpGetAllUsers(req, res, next) {
  const users = await GetAllUsers();
  return res.status(200).json({
    status: "sucess",
    length: users.length,
    users,
  });
}

async function httpUpdateMe(req, res, next) {
  const filter = filterObj(req.body, "firstName", "lastName", "email");
  const updatedUser = await UpdateMe(req.user._id, filter);
  return res.status(200).json({
    status: "sucess",
    user: updatedUser,
  });
}

async function httpfindOnerUser(req, res, next) {
  const { id } = req.params;
  const user = await findOnerUser({ _id: id });
  if (!user) {
    return next(new appError("User is not found"));
  }
  return res.status(200).json({
    status: "sucess",
    user,
  });
}

module.exports = {
  httpSigUp,
  httpGetAllUsers,
  httpUpdateMe,
  httpfindOnerUser,
};
