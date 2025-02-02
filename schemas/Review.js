const { Schema, model } = require("mongoose");

const ReviewSchema = new Schema({
  content: {
    type: String,
    required: true,
    minLength: 3,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

module.exports = model("Review", ReviewSchema);
