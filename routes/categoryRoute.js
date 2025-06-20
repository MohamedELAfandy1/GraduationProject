const express = require("express");
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator.js");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryimage,
  resizeCategoryImage,
} = require("../controllers/categoryController.js");

const { auth, allowedTo } = require("../controllers/authController.js");

const router = express.Router();

router
  .route("/")
  .post(
    auth,
    allowedTo("admin"),
    uploadCategoryimage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  )
  .get(getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    auth,
    allowedTo("admin"),
    uploadCategoryimage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(auth, allowedTo("admin"), deleteCategoryValidator, deleteCategory);

const attractionRoute = require("./attractionRoute.js");
router.use("/:categoryId/attractions", attractionRoute);

module.exports = router;
