const { passport } = require("../../middleware/passport");

/*
function httpCallbackURL(req, res, next) {
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
  })(req, res, next);
}
*/
function httpLogin(req, res, next) {
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })(req, res, next);
}

function httpCallbackURL(req, res, next) {
  passport.authenticate("google", { session: false }, (err, token) => {
    if (err) {
      return next(err);
    }
    return res.status(201).json({ token });
  })(req, res, next);
}

function httplogOut(req, res) {
  req.logout(); //Removes req.user and clears any logged in session
  return res.redirect("/");
}

module.exports = {
  httpCallbackURL,
  httpLogin,
  httplogOut,
};
