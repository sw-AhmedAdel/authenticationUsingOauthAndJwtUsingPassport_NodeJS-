const appError = require("./classError.global.express");
const { logger } = require("../logger/logger");

function JsonWebTokenError() {
  const message = "Token is invalid, Please login or signup";
  return new appError(message, 401);
}

function handelJwtExpired() {
  const message = "Token is expired, please login";
  return new appError(message, 401);
}

function handleInvalidMongoId(error) {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new appError(message, 400);
}

function handleDublicateValues(error) {
  const message = `this value: ${Object.values(
    error.keyValue
  )} is already exits`;
  return new appError(message, 400);
}

function handelValidationError(error) {
  // loop throw each obj
  const errors = Object.values(error.errors).map((err) => err.message);
  const message = `Invalid Errors: ${errors.join(". ")}`; // make array string
  return new appError(message, 400);
}

function sendErrorDev(err, res) {
  // Send me the error in the dev
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    // It means the error i handeled it myself
    return res.status(err.statusCode).json({
      status: err.status,
      msg: err.message,
    });
  }
  //console.error("Error: ", err);
  return res.status(err.statusCode).json({
    status: err.status,
    msg: "Server is down, Please try again later",
  });
}

function globalErrorHnadling(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  logger.error("Uncaught Exception:", err);

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // Error for wrong id
    let error = Object.assign(err);

    if (error.name === "CastError") {
      error = handleInvalidMongoId(error);
    }

    // handle dublicate values using unique: true
    if (error.code === 11000 && error.statusCode === 500) {
      error = handleDublicateValues(error);
    }

    //Handling Mongoose Validation Errors
    if (error.name === "ValidationError" && error.statusCode === 500) {
      error = handelValidationError(error);
    }

    if (
      error.name === "JsonWebTokenError" &&
      err.message === "invalid signature"
    ) {
      error = JsonWebTokenError();
    }

    if (err.message === "jwt expired") {
      error = handelJwtExpired();
    }

    sendErrorProd(error, res);
  }
}

module.exports = { globalErrorHnadling, handelValidationError };
