const Category = require("../schemas/Category");

//Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (category.listOfCourses && category.listOfCourses.length > 0) {
      return res
        .status(400)
        .json({ message: "Category with courses can't be deleted." });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Category successfully deleted." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Edit a category image
const editCategoryImage = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const image = req.file ? req.file.path : null;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { image },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    res
      .status(200)
      .json({ message: "Category image successfully updated.", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Edit category details
const editCategoryDetails = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { title, description, shortDescription } = req.body;

    const updatedFields = {};

    //if there is a field to update then use it
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (shortDescription) updatedFields.shortDescription = shortDescription;

    //built-in method of js to retrieve all name properties of an object. In this case i´d be either title, description or shortDescription
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No fields to update." });
    }
    const category = await Category.findByIdAndUpdate(
      categoryId,
      updatedFields,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category details updated.", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Create a category
const createCategory = async (req, res) => {
  try {
    const { title, shortDescription, description } = req.body;
    const image = req.file ? req.file.path : null;
    if (!title || !shortDescription || !description || !image) {
      return res.status(400).json({ message: "All fields are needed." });
    }
    const category = await Category.create({
      title,
      description,
      shortDescription,
      image,
    });
    res
      .status(201)
      .json({ message: "Category successfully created.", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//get category
const getOneCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).populate("listOfCourses");

    if (!category) {
      res.status(200).json({ message: "Category not found." });
    } else {
      res.status(200).json({ category });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("listOfCourses");
    if (!categories.length) {
      res.status(200).json({ message: "No categories found." });
    } else {
      res.status(200).json({ categories });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getOneCategory,
  createCategory,
  deleteCategory,
  editCategoryDetails,
  editCategoryImage,
};
