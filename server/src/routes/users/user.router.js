const express = require("express");
const userRouter = express.Router();
const {
  httpGetAllUsers,
  httpUpdateMe,
  httpfindOnerUser,
  httpSigUp,
} = require("./user.controller");
const { catchAsync } = require("../../services/servicesFunctions");

const { permission, checkLoggedIn } = require("../../middleware/auth");

userRouter.post("/signup", catchAsync(httpSigUp));

userRouter.use(catchAsync(checkLoggedIn));

userRouter.get("/", permission("admin"), catchAsync(httpGetAllUsers));
userRouter.get("/find/:id", catchAsync(httpfindOnerUser));
userRouter.get("/updateme", catchAsync(httpUpdateMe));

module.exports = userRouter;
