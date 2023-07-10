const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy } = require("passport-google-oauth20");
const { CreateUser, findOnerUser } = require("../models/user.models");
const { generatePasswordFun } = require("../services/servicesFunctions");
const appError = require("../services/classError.global.express");
///////////// use passport for JWT

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY_JWT,
};

async function verifyCallbackJWT(jwtPayload, done) {
  try {
    // Check if the user exists in the database
    const user = await findOnerUser({ _id: jwtPayload.id });
    if (!user) {
      return done(new appError("Please login", 401));
    }
    return done(null, user); // User authenticated successfully
  } catch (err) {
    return done(err);
  }
}

passport.use(new JwtStrategy(jwtOptions, verifyCallbackJWT));

//////////// use passprt for GOOGLE
const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
};

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

async function verifyCallbackAauth(accessToken, refreshToken, profile, done) {
  let user = await findOnerUser({ email: profile._json.email });
  let token;

  try {
    if (!user) {
      user = {
        firstName: profile._json.given_name,
        lastName: profile._json.family_name,
        email: profile._json.email,
        password: generatePasswordFun(),
        singUsingGoogle: true,
      };
      user = await CreateUser(user);
    }
    return done(null, profile);
  } catch (err) {
    done(err);
  }
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallbackAauth));
// Save the session to the cookie

passport.serializeUser((user, done) => {
  done(null, user.emails[0].value);
});

passport.deserializeUser((email, done) => {
  done(null, email);
});

module.exports = {
  passport,
};
