// services/upload.js
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "app", // Folder name in Cloudinary
    allowedFormats: ["jpg", "png", "jpeg", "mp4"], // Allowed file formats
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Image transformation
  },
});

// Initialize multer with the Cloudinary storage setup
const upload = multer({ storage: storage });

module.exports = upload; // Export the `upload` middleware
