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
app.get("/your_reviews", requireAuth("user"), getYourReviews);
app.get("/:reviewId", getOneReview);
app.get("/course/:id", getAllForOneCourse);

app.post("/create", requireAuth("user"), createReview);
app.put("/edit/:reviewId", requireAuth("user"), updateReview);
app.delete("/delete/:reviewId", requireAuth("user"), deleteReview);

module.exports = app;
