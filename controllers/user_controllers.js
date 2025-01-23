//create
//edit details
//edit profile Picture
//delete
//get one user according to id
//get all users (admin)
//login
//signup
//add to favorites
//remove from favorites

//login
const mongoose = require("mongoose");
const User = require("../schemas/User");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.secret);
};

//login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // Create token
    const token = createToken(user._id);

    // Return firstName along with email and token
    res.status(200).json({
      email: user.email,
      firstName: user.firstName,
      profileImage: user.profileImage,
      token,
      id: token._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//// signUpUser
const signUpUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    userName,
    password,
    profileImage,
    review,
    favourites,
    isActive,
    isOnline,
    role,
  } = req.body;

  try {
    const user = await User.signup(
      firstName,
      lastName,
      email,
      userName,
      password,
      profileImage,
      review,
      favourites,
      isActive,
      isOnline,
      role
    );

    //create token
    const token = createToken(user._id);

    // Return firstName along with email and token
    res.status(200).json({
      email: user.email,
      firstName: user.firstName,
      profileImage: user.profileImage,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all the users whose role=admin

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins); // Send the result back as JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signUpUser,
  getAllAdmins,
};
