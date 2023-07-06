const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    singUsingGoogle: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      requird: [true, "First name must be provided"],
    },
    lastName: {
      type: String,
      requird: [true, "Last name must be provided"],
    },
    email: {
      type: String,
      unique: true,
      requird: [true, "Email name must be provided"],
      validate: [validator.isEmail, "please provide a valid email"],
    },

    password: {
      type: String,
      requird: [true, "Password name must be provided"],
      minlengh: [8, "password must be more rqual or more than 8 chars"],
    },

    role: {
      type: String,
      default: "admin",
      enum: {
        values: ["user", "admin"],
        message: "Role must be user or admin",
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
/*
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.role;
  delete user.active;
  delete user.singUsingGoogle;
  return user;
};*/

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next;
  user.password = await bcrypt.hash(user.password, 12);
  return next();
});

userSchema.methods.generateAuthToken = function () {
  const user = this;

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY_JWT, {
    expiresIn: process.env.EXPIRES_IN,
  });
  return token;
};

const User = mongoose.model("UserGoogle", userSchema);
module.exports = User;
