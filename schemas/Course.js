const { Schema, model } = require("mongoose");

const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
  },
  description: {
    type: String,
    minLength: 10,
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
  images: [{ type: String, required: true }],
  video: {
    type: String,
    required: false,
  },
  intensity: { enum: ["beginners", "intermediate", "experienced"] },
  equipment: {
    type: Boolean, // Boolean for yes/no
    required: true,
  },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  favorized: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Course", CourseSchema);
