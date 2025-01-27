const Course = require("../schemas/Course");
const Category = require("../schemas/Category");

//create course
const createCourse = async (req, res) => {
  try {
    const { title, description, intensity, equipment, category } = req.body;
    const mainImage = req.files?.mainImage?.[0]?.path || null;
    const images = req.files?.images?.map((file) => file.path) || [];
    const video = req.files?.video?.[0]?.path || null;

    if (
      !title ||
      !intensity ||
      !description ||
      !equipment ||
      !category ||
      !category.length
    ) {
      return res.status(400).json({ message: "All fields are needed." });
    }

    const course = await Course.create({
      title,
      description,
      intensity,
      equipment,
      category,
      mainImage,
      images,
      video,
    });

    res.status(201).json({ message: "Course successfully created.", course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//edit course details
const editCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, equipment, intensity } = req.body;

    const updatedFields = {};

    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (equipment) updatedFields.equipment = equipment;
    if (intensity) updatedFields.intensity = intensity;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No fields to update." });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Course successfully updated.", updatedCourse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//edit MainImage and Video
const editMainMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const mainImage = req.files?.mainImage?.[0]?.path || null;
    const video = req.files?.video?.[0]?.path || null;

    const updatedFields = {};
    if (mainImage) updatedFields.mainImage = mainImage;
    if (video) updatedFields.video = video;

    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No media files provided to update." });
    }

    const course = await Course.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json({ message: "Media updated successfully.", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({ message: "Course has been successfully deleted." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//get course
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate(
      "category favorized reviews"
    );
    if (!course) {
      return res.status(400).json({ message: "Course not found." });
    }
    res.status(200).json(course);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//get all courses (filtered bny category or all)
const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find().populate("category favorized reviews");

    if (!courses.length) {
      return res.status(400).json({ message: "Courses not found." });
    }
    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//edit Categories of a course
const updateCourseCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const { newCategoryIDs } = req.body;

    if (!Array.isArray(newCategoryIDs)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing category IDs array." });
    }
    const course = await Course.findById(id);
    if (!course) {
      return res.status(400).json({ message: "Course could not be found." });
    }

    const currentCategoryIds = course.category.map((catId) => catId.toString());

    const categoriesToAdd = newCategoryIDs.filter(
      (id) => !currentCategoryIds.includes(id)
    );
    const categoriesToRemove = currentCategoryIds.filter(
      (id) => !newCategoryIDs.includes(id)
    );

    course.category = newCategoryIDs;
    await course.save();

    if (categoriesToAdd.length > 0) {
      await Category.updateMany(
        { _id: { $in: categoriesToAdd } },
        { $addToSet: { listOfCourses: course._id } }
      );
    }

    if (categoriesToRemove.length > 0) {
      await Category.updateMany(
        { _id: { $in: categoriesToRemove } },
        { $pull: { listOfCourses: course._id } }
      );
    }

    res.status(200).json({
      message: "Categories successfully updated",
      updatedCourse: course,
      removed: categoriesToRemove,
      added: categoriesToAdd,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllCourse,
  getCourse,
  editCourseDetails,
  editMainMedia,
  updateCourseCategories,
  deleteCourse,
  createCourse,
};
