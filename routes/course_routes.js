const express = require("express");
const upload = require("../services/upload");
const {
  getAllCourse,
  getCourse,
  editCourseDetails,
  editMainMedia,
  updateCourseCategories,
  deleteCourse,
  createCourse,
} = require("../controllers/course_controllers");
const checkAuthorization = require("../middlewares/checkAuthorization");
const requireAuth = require("../middlewares/requireAuth");

const app = express.Router();

app.get("/", getAllCourse);
app.get("/:id", getCourse);

app.use(requireAuth("admin"));

app.post(
  "/create",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  createCourse
);

app.put(
  "/edit_media/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  editMainMedia
);

app.put("/edit_details/:id", editCourseDetails);
app.put("/edit_category/:id", updateCourseCategories);
app.delete("/delete/:id", deleteCourse);

module.exports = app;
