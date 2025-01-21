const { Schema, model } = require("mongoose");

const CategorySchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
  },
  shortDescription: {
    type: String,
    minLength: 10,
    maxLength: 200,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
  },
  image: {
    type: String,
    required: true,
  },
  listOfCourses: [
    {
      type: Schema.Types.ObjectId,
      ref: "course",
    },
  ],
});

module.exports = model("Category", CategorySchema);
