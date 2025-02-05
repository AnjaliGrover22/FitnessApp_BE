# Fitness App - Backend

## Overview

Fitness App Backend is built with **Node.js**, **Express**, and **MongoDB** using **Mongoose** for database management. The backend supports user authentication, course management, reviews, and image uploads. Cloudinary and Multer are used for handling image uploads, while **JWT-based authentication** and **role-based access control** are implemented for security. The backend provides an API for the frontend to interact with.

### Features

- **User Authentication**: JWT-based authentication for users and admins.
- **Course Management**: CRUD operations for courses, including categories and reviews.
- **Role-based Access Control**: Middleware to restrict access based on user roles ("user" or "admin").
- **Image Uploads**: Using Cloudinary and Multer for handling file uploads.
- **Database**: MongoDB with Mongoose schemas for courses, categories, users, and reviews.

---

## Table of Contents

- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
- [Contributing](#contributing)

---

## Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v14+ recommended)
- **npm** (v6+)

### Step-by-Step Guide

### 1\. Install Necessary Dependencies

The backend of this application uses the following dependencies. We install them in stages to set up essential features like authentication, image/video uploading, and database interaction.

#### a. Install Core Dependencies:

`npm install cors dotenv express mongoose`

- **`express`**: Web framework for Node.js that simplifies routing and request handling.
- **`mongoose`**: Object Data Modeling (ODM) library for MongoDB, used to define schemas and interact with the database.
- **`cors`**: Enables Cross-Origin Resource Sharing (CORS) for API requests from different origins.
- **`dotenv`**: Loads environment variables from a `.env` file to keep sensitive information (like database credentials) secure.

#### b. Install User Authentication and Validation Dependencies:

`npm install validator jsonwebtoken bcrypt`

- **`validator`**: A library used to validate and sanitize user inputs (e.g., email, password).
- **`jsonwebtoken`**: Used to generate and verify JWT tokens for user authentication.
- **`bcrypt`**: A library to hash user passwords before storing them in the database for added security.

#### c. Install Cloudinary and Multer for Image/Video Upload:

`npm install cloudinary multer multer-storage-cloudinary`

- **`cloudinary`**: Provides a cloud service for storing and managing images and videos.
- **`multer`**: Middleware for handling multipart/form-data (used for uploading files).
- **`multer-storage-cloudinary`**: A storage engine for Multer to directly upload files to Cloudinary.

### 2\. Set Up Cloudinary and Multer for File Upload

In `services/upload.js`, configure the Cloudinary storage engine to handle both image and video uploads. We set the `resource_type` to `auto` so Cloudinary can automatically determine if the uploaded file is an image or video.

Here's how the file looks:

```
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // This will automatically detect if the uploaded file is an image or video
    resource_type: "auto",
    folder: "app", // The folder name in Cloudinary
    allowedFormats: ["jpg", "png", "jpeg", "mp4", "webm"], // Image and video formats
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
```

### 3\. Set Up `nodemon` for Development

We install `nodemon` to automatically restart the backend server when code changes are made, making the development process smoother. We add the following scripts to `package.json`:

```
"scripts": {
  "dev": "node --watch server.js",  // This will automatically restart on code changes.
  "start": "node server.js"         // Run server normally in production.
}`
```

---

## Folder Structure

### Breakdown:

- **node_modules/**: The default directory created by `npm` to store all installed dependencies.
- **database/**: Contains the MongoDB database initialization logic.
  - **dbinit.js**: Sets up the connection to the MongoDB database.
- **controllers/**: Logic for handling the API request and responses, including CRUD operations.
  - Files like `reviewController.js`, `categoryController.js`, `courseController.js`, and `userController.js` manage the business logic for their respective entities.
- **routes/**: Defines API routes and links them to the appropriate controller.
  - Files like `reviewRoutes.js`, `categoryRoutes.js`, `courseRoutes.js`, and `userRoutes.js` set up the routes for each feature.
- **schemas/**: Contains Mongoose schemas for MongoDB collections.
  - Files like `reviewSchema.js`, `categorySchema.js`, `courseSchema.js`, and `userSchema.js` define the structure for each collection in MongoDB.
- **services/**: Contains services like the image upload functionality using Multer and Cloudinary.
  - **upload.js** handles the configuration for uploading images to Cloudinary.
- **middlewares/**: Holds middleware functions that are used to protect routes and manage authentication.
  - **requireAuth.js** checks if the user is authenticated and if they have the required roles to access specific resources.
- **server.js**: Entry point of the backend application. It initializes the server and connects all routes, controllers, and middlewares.
- **.gitignore**: Defines files and directories that Git should ignore (e.g., `node_modules/`, `.env` files).
- **package.json**: Contains metadata about the project (dependencies, scripts, etc.).
- **package-lock.json**: Ensures that the exact versions of dependencies are installed across all environments.
- **README.md**: Project documentation, including installation, usage instructions, etc.

---

### Structure

```
├── node_modules/         # Contains all the installed dependencies
├── database/         # MongoDB connection and initialization
│ └── dbinit.js         # Sets up MongoDB connection
├── controllers/         # Logic for handling API requests
│ ├── reviewController.js
│ ├── categoryController.js
│ ├── courseController.js
│ └── userController.js
├── routes/ # API routes
│ ├── reviewRoutes.js
│ ├── categoryRoutes.js
│ ├── courseRoutes.js
│ └── userRoutes.js
├── schemas/         # Mongoose schemas for MongoDB
│ ├── reviewSchema.js
│ ├── categorySchema.js
│ ├── courseSchema.js
│ └── userSchema.js
├── services/         # File upload and other services
│ └── upload.js         # Multer and Cloudinary setup for file uploads
├── middlewares/         # Middleware functions (authentication, roles)
│ └── requireAuth.js         # Middleware to enforce authentication and roles
├── server.js         # The main entry point for the Express server
├── .gitignore         # Specifies files to be ignored by Git
├── package-lock.json         # Ensures consistent dependency versions
├── package.json         # Project metadata and dependencies
└── README.md         # Project documentation
```

---

## Usage

To install all the required dependencies, run the following command in your project directory:

`npm install`

This will install all dependencies listed in the `package.json` file.

To start the backend server, use the following command:

`npm start`

This will start the Express server, allowing you to interact with the API.

---

## Contributing

We welcome contributions! If you'd like to help improve this project, please fork the repository, make changes, and submit a pull request.
