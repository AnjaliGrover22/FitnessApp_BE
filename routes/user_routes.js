const express = require("express");
const {
  loginUser,
  signUpUser,
  createUser,
  editUserDetails,
  getAllAdmins,
  getAllUsers,
  getUserById,
  deleteUser,
  addToFavorites,
  removeFromFavorites,
} = require("../controllers/user_controllers");

const app = express.Router();

// get all users (for admins)
app.get("/admins", getAllAdmins);

app.get("/allusers", getAllUsers);

// Login
app.post("/login", loginUser);

// Signup
app.post("/signup", signUpUser);

// Create User
app.post("/create", createUser);

// Edit User Details
app.put("/edit/:id", editUserDetails);

//delete the User
app.delete("/delete/:id", deleteUser);

// get User by Id
app.get("/:id", getUserById);

//get all added favourites
app.put("/:id/favorites", addToFavorites);

//delete the favourite
app.delete("/:id/favorites", removeFromFavorites);

module.exports = app;
