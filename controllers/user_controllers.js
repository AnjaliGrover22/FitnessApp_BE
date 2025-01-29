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
  return jwt.sign({ _id }, process.env.SECRET);
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
      token,
      id: user._id,
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
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      profileImage: user.profileImage,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Create User
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res
      .status(201)
      .json({ message: "New user has been successfully created", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Edit User Details
const editUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get the user with user id
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all the users whose role are admin
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins); // Send the result back as JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// all users whose role is user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.status(200).json(users); // Send the result back as JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add to Favorites
const addToFavorites = async (req, res) => {
  const { id } = req.params; // User ID
  const { favourite } = req.body; // Course ID to add

  if (!mongoose.Types.ObjectId.isValid(favourite)) {
    return res.status(400).json({ error: "Invalid Course ID" });
  }

  try {
    // Ensure course exists (optional)
    const courseExists = await Course.findById(favourite);
    if (!courseExists) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Add to favourites
    const user = await User.findByIdAndUpdate(
      id,
      { $addToSet: { favourites: favourite } }, // Avoid duplicates
      { new: true }
    ).populate("favourites"); // Populate favourites with course details (optional)

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

// Remove from Favorites
const removeFromFavorites = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { favourites: favorite } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Upload or Edit User Image (using Cloudinary)
const editProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure user exists before attempting to upload the image
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the file was uploaded correctly by multer
    if (req.file && req.file.path) {
      user.profileImage = req.file.path;
      await user.save({ validateBeforeSave: false });

      return res.status(200).json({
        message: "Profile image uploaded successfully",
        user,
      });
    } else {
      return res
        .status(422)
        .json({ message: "Invalid profile image or no file uploaded" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
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
};
