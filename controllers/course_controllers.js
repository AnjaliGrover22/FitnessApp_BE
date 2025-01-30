const Course = require("../schemas/Course");
const Category = require("../schemas/Category");

//create course (>-<)
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

    await Category.updateMany(
      { _id: { $in: category } },
      { $addToSet: { listOfCourses: course._id } }
    );

    res.status(201).json({ message: "Course successfully created.", course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//edit course details (>-<)
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
      runValidators: true,
    });

    res
      .status(200)
      .json({ message: "Course successfully updated.", updatedCourse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//edit MainImage and Video (>-<)
const editMainMedia = async (req, res) => {
  console.log("Controller is running...");
  try {
    const { id } = req.params;

    const mainImage = req.files?.mainImage?.[0]?.path || null;
    const video =
      req.files?.video?.[0]?.secure_url || req.files?.video?.[0]?.path || null; // Try both secure_url and path

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
      runValidators: true,
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

//edit images of course gallery
const updateImages = async (req, res) => {};

//delete course (>-<)
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

//get course (>-<)
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

//get all courses (filtered bny category or all) (>-<)
const getAllCourse = async (req, res) => {
  try {
    const { intensity, category, equipment, minRating, maxRating } = req.query;
    let filter = {};

    //GET /course?intensity=advanced
    if (intensity) {
      filter.intensity = intensity;
    }

    //GET /courses?category=123,456
    //$in to match an array of values
    //category parameter will be passed from frontend as a String of category IDs, which we split at the coma and make into an array of Strings, each of one ID, eg: ?category=123,456,789, the result will be ['123', '456', '789']
    if (category) {
      filter.category = { $in: category.split(",") };
    }

    //GET /courses?equipment=true
    //From frontend we receive either "true" or "false" as Strings, not boolean. To convert it we compare it to the String "true". If the frontend sends "true", then it will be true. If it sends "false", then it will be not match and hence false;
    if (equipment !== undefined) {
      filter.equipment = equipment === "true";
    }

    //GET /courses?minRating=3&maxRating=5
    //$gte means "greater than or equal to", and $lte means "less than or equal to"
    if (maxRating || minRating) {
      filter.averageRating = {};
      if (minRating) filter.averageRating.$gte = minRating;
      if (maxRating) filter.averageRating.$lte = maxRating;
    }

    const courses = await Course.find(filter).populate(
      "category favorized reviews"
    );

    if (!courses.length) {
      return res.status(400).json({ message: "Courses not found." });
    }
    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//edit Categories of a course (>-<)
//send from frontend the categories you want it to be in
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

    //categories not included in the existing categories of this course
    const categoriesToAdd = newCategoryIDs.filter(
      (id) => !currentCategoryIds.includes(id)
    );
    //categories that are not in the new categories, but were in the current categories
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
