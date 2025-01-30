const express = require("express");
const {
  getAllForOneCourse,
  createReview,
  getYourReviews,
  deleteReview,
  updateReview,
  getOneReview,
  getAllReviews,
} = require("../controllers/review_controllers");
const requireAuth = require("../middlewares/requireAuth");
const app = express.Router();

app.get("/", requireAuth("admin"), getAllReviews);
app.get("/:reviewId", getOneReview);
app.get("/your_reviews", getYourReviews);
app.get("/course/:id", getAllForOneCourse);

app.post("/create", requireAuth("user"), createReview);
app.put("/edit/:reviewId", updateReview);
app.delete("/delete/:reviewId", deleteReview);

module.exports = app;
