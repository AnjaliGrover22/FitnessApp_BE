const express = require("express");
const { getAllForOneCourse } = require("../controllers/review_controllers");
const app = express.Router();

app.get("/course/:id", getAllForOneCourse);

module.exports = app;
