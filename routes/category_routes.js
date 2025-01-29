const express = require("express");
const upload = require("../services/upload");
const checkAuthorization = require("../middlewares/checkAuthorization");
const requireAuth = require("../middlewares/requireAuth");
const {
  getAllCategories,
  getOneCategory,
  createCategory,
  deleteCategory,
  editCategoryDetails,
  editCategoryImage,
} = require("../controllers/category_controllers");

const app = express.Router();

app.get("/", getAllCategories);
app.get("/:id", getOneCategory);

app.use(requireAuth("admin"));

app.post("/create", upload.single("image"), createCategory);
app.delete("/delete/:id", deleteCategory);
app.put("/edit_details/:id", editCategoryDetails);
app.put("/edit_image/:id", upload.single("image"), editCategoryImage);

module.exports = app;
