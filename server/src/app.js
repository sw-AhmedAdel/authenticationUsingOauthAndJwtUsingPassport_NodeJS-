const express = require("express");

const app = express();
const path = require("path");
const helmet = require("helmet");
const api = require("./routes/api");
const cookieSession = require("cookie-session");
const { passport } = require("./middleware/passport");
const { checkLoggedIn } = require("./middleware/auth");
const googleRouter = require("./routes/google/google.router");
const { catchAsync } = require("./services/servicesFunctions");
const { expressWinstonMiddleWare } = require("./logger/logger");
const appError = require("./services/classError.global.express");
const { globalErrorHnadling } = require("./services/global.errors.handling");

app.use(helmet());
app.use(express.json());
expressWinstonMiddleWare(app);

app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/secret", checkLoggedIn, (req, res) => {
  return res.send("Your personal secret value is 42!");
});

app.get("/failure", (req, res) => {
  return res.send("Failed to log in!");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.use("/v1", api);
app.use("/auth", googleRouter);

app.all("*", (req, res, next) => {
  return next(new appError("Rouut is not exits!", 404));
});
app.use(globalErrorHnadling);
module.exports = app;

/*
app.get("/auth/google", login);

app.get("/auth/google/callback", callbackURL);

app.get("/auth/logout", logOut);*/
