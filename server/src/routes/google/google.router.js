const express = require("express");
const googleRouter = express.Router();

const {
  httpCallbackURL,
  httpLogin,
  httplogOut,
} = require("./google.controler");

googleRouter.get("/google", httpLogin);
googleRouter.get("/google/callback", httpCallbackURL);
googleRouter.get("/logout", httplogOut);
module.exports = googleRouter;
