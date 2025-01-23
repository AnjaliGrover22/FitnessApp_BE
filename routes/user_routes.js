const express = require("express");
const { loginUser, signUpUser } = require("../controllers/user_controllers");

const app = express.Router();

// Login
app.post("/login", loginUser);

// Signup
app.post("/signup", signUpUser);

module.exports = app;
