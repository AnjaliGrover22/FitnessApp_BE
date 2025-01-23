const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email format"],
  },
  userName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    validate: [
      (value) => validator.isStrongPassword(value),
      "Make sure to use at least 8 characters, one upper case letter, a number and a symbol",
    ],
  },
  profileImage: {
    type: String,
    default:
      "https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg",
  },
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

//custom static method for signup

userSchema.statics.signup = async function (
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
) {
  const exists = await this.findOne({ email });

  // If a user with that email exists, throw an error
  if (exists) {
    throw new Error("Email already in use");
  }

  // Ensure all required fields are filled
  if (!email || !password || !firstName || !lastName) {
    throw new Error("All required fields must be filled");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password must be at least 8 characters long, include one uppercase letter, one number, and one symbol"
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    email,
    userName,
    password: hash,
    profileImage,
    review,
    favourites,
    isActive,
    isOnline,
    role,
  });

  return user;
};

// static custom login method

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("user doesn't exist or incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
