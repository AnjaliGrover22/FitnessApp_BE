const express = require("express");
const upload = require("../services/upload");
const requireAuth = require("../middlewares/requireAuth");
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
  editProfilePicture,
} = require("../controllers/user_controllers");

const app = express.Router();

// get all users (for admins)
app.get("/admins", requireAuth("admin"), getAllAdmins);

app.get("/allusers", requireAuth("admin"), getAllUsers);

// Login
app.post("/login", loginUser);

// Signup
app.post("/signup", signUpUser);

// Create User
app.post("/create", requireAuth("admin"), createUser);

// Edit User Details
app.put("/edit/:id", requireAuth(), editUserDetails);

//delete the User
app.delete("/delete/:id", requireAuth("admin"), deleteUser);

// get User by Id
app.get("/:id", requireAuth(), getUserById);

//get all added favourites
app.put("/:id/favorites", requireAuth("user"), addToFavorites);

//delete the favourite
app.delete("/:id/favorites", requireAuth("user"), removeFromFavorites);

//edit profile pictures
app.route("/:id/uploadImage").put(upload.single("picture"), editProfilePicture);

module.exports = app;
