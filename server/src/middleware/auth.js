const { findOnerUser } = require("../models/user.models");
const appError = require("../services/classError.global.express");
const { passport } = require("../middleware/passport");

async function checkLoggedIn(req, res, next) {
  //req.headers.authorization = "";
  console.log(req.headers.authorization);
  if (req.isAuthenticated() && req.user) {
    const user = await findOnerUser({ email: req.user });
    if (!user) {
      return next(new appError("Please login ", 401));
    }
    req.user = user;
    next();
  } else if (req.headers.authorization) {
    passport.authenticate("jwt", { session: false }, async (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new appError("Please login", 401));
      }
      req.user = user;
      next();
    })(req, res, next);
  } else {
    return next(new appError("Please sing in ", 401));
  }
}

const permission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new appError("You dont have permission to do that", 403));
    }
    next();
  };
};

module.exports = {
  checkLoggedIn,
  permission,
};

/*async function checkLoggedIn(req, res, next) {
  //req.headers.authorization = "";
  console.log(req.headers.authorization);
  if (req.isAuthenticated() && req.user) {
    const user = await findOnerUser({ email: req.user });
    if (!user) {
      return next(new appError("Please login ", 401));
    }
    req.user = user;
    next();
  } else if (req.headers.authorization) {
    passport.authenticate("jwt", { session: false }, async (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new appError("Please login", 401));
      }
      req.user = user;
      next();
    })(req, res, next);
  } else {
    return next(new appError("Please sing in ", 401));
  }
}*/
