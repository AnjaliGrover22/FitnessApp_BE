//create review
//delete
//edit
const Review = require("../schemas/Review");

//get your own reviews by user id
const getAllForOneCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ course: courseId }).populate("course");

    if (!reviews.length) {
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

module.exports = {
  getAllForOneCourse,
};
