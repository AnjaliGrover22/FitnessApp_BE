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
    //That will ensure Cloudinary can assign the resource_type automatically based on the uploaded file rather than it defaulting to "image"
    resource_type: "auto",
    folder: "app",
    allowedFormats: ["jpg", "png", "jpeg", "mp4", "webm"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Initialize multer with the Cloudinary storage setup
const upload = multer({ storage: storage });

module.exports = upload; // Export the `upload` middleware
