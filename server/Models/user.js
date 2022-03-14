const mongoose = require("mongoose");
const crypto = require("crypto")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  phone: {
    type: Number,
    required: [true, "Name is required field"],
    maxlength:[10,"Phone number invalid"],
    minLength:[10,"Phone number invalid"],
  },
  email: {
    type: String,
    required: [true, "Email is required field"],
    max: 100,
  },
  password: {
    type: String,
    required: [true, "Password is required field"],
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
  },
  condidates: [
    {
      name: {
        type: String,
        required: [true, "Name is required field"],
        max: 200,
      },
      email: {
        type: String,
        required: [true, "Email is required field"],
        max: 100,
      },
      dob: {
        type: String,
        required: [true, "DOB is required field"],
      },
      status: {
        type: String,
        required: [true, "status is required field"],
      },
      age:{
        type:Number,
        required: [true, "Age is required field"],
      },
      pincode:{
        type:Number,
        required: [true, "Pincode is required field"],
      },
      state:{
        type: String,
        required: [true, "state is required field"],
      },
      adress:{
        type: String,
        required: [true, "Adress is required field"],
      }
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
