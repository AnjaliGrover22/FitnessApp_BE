const express = require("express");
const {
  loginUser,
  signUpUser,
  getAllAdmins,
} = require("../controllers/user_controllers");

const app = express.Router();

// Login
app.post("/login", loginUser);

// Signup
app.post("/signup", signUpUser);

// get all users (for admins)
app.get("/admins", getAllAdmins);

module.exports = app;
