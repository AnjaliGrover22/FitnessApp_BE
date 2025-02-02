//create review
const Course = require("../schemas/Course");
const Review = require("../schemas/Review");

//create  (>-<)
const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, rating, courseId } = req.body;
    const newReview = await Review.create({
      rating,
      content,
      course: courseId,
      user: userId,
    });

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    //get all reviews for this course
    const courseReviews = await Review.find({ course: courseId });

    //count the ratings of all these reviews
    const totalRatings = courseReviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );

    //divide them by the number of reviews to get average rating of course
    const averageRating =
      courseReviews.length > 0 ? totalRatings / courseReviews.length : 0;

    //so it only shows 1, 1.5, 2, 2.5 etc.
    const roundedRating = Math.min(Math.round(averageRating * 2) / 2, 5);

    course.averageRating = roundedRating;
    course.reviews.push(newReview._id);
    await course.save();

    res.status(201).json({
      message: "New review created:",
      newReview,
      updatedCourseRating: course.averageRating,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//delete (>-<)
const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId).select("user course rating");

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    //make sure that only maker of the review can delete it
    if (review.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this review." });
    }

    const course = await Course.findById(review.course);
    if (!course) {
      return res.status(400).json({ message: "Course not found." });
    }

    await Review.findByIdAndDelete(reviewId);

    const remainingReviews = await Review.find({ course: course._id });
    const totalRatings = remainingReviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );

    const averageRating =
      remainingReviews.length > 0 ? totalRatings / remainingReviews.length : 0;

    course.averageRating = Math.min(Math.round(averageRating * 2) / 2, 5);

    await course.save();

    res.status(200).json({
      message: "Review successfully deleted.",
      updatedCourseRating: course.averageRating,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//edit (>-<)
const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, rating } = req.body;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    //make sure that only maker of the review can edit it
    if (review.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this review." });
    }

    const updatedFields = {};

    if (content) updatedFields.content = content;
    if (rating) updatedFields.rating = rating;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updatedFields,
      {
        new: true,
        runValidators: true,
      }
    );

    const course = await Course.findById(updatedReview.course);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const courseReviews = await Review.find({ course: course._id });

    const totalRatings = courseReviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const averageRating =
      courseReviews.length > 0 ? totalRatings / courseReviews.length : 0;

    course.averageRating = Math.min(Math.round(averageRating * 2) / 2, 5);

    await course.save();

    res.status(200).json({
      message: "Review successfully updated",
      review: updatedReview,
      updatedCourseRating: course.averageRating,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//get your own reviews by user id (>-<)
const getYourReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.find({ user: userId }).populate("course user");

    if (reviews.length === 0) {
      return res.status(400).json({ message: "No reviews found." });
    }

    res.status(200).json({ message: "Reviews found:", reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//get one review (>-<)
const getOneReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId).populate("course");

    if (!review) {
      return res.status(400).json({ message: "Review not found." });
    }

    res.status(200).json({ message: "Review found:", review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//get all reviews of one course (>-<)
const getAllForOneCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const reviews = await Review.find({ course: courseId }).populate(
      "course user"
    );

    if (reviews.length === 0) {
      return res
        .status(400)
        .json({ message: "No reviews found for this course." });
    }

    res.status(200).json({ message: "Reviews found:", reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//get all reviews (>-<)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("course user");

    if (!reviews.length) {
      return res.status(400).json({ message: "No reviews found." });
    }

    res.status(200).json({ message: "Reviews found:", reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllForOneCourse,
  createReview,
  getYourReviews,
  deleteReview,
  updateReview,
  getOneReview,
  getAllReviews,
};
