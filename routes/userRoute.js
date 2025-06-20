const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,

  uploadUserImage,
  resizeUserImage,

  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactiveLoggedUser,
} = require("../controllers/userController.js");

const {
  createUserValidator,
  updateUserValidator,
  getUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  changeLoggedUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator.js");

const { auth, allowedTo } = require("../controllers/authController.js");

const router = express.Router();

router.get("/getMe", auth, getLoggedUserData, getUserById);
router.put(
  "/updateMe",
  auth,
  uploadUserImage,
  resizeUserImage,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router.put(
  "/changeMyPassword",
  auth,
  changeLoggedUserPasswordValidator,
  updateLoggedUserPassword
);
router.delete("/deactiveMe", auth, deactiveLoggedUser);

router
  .route("/")
  .get(auth, allowedTo("admin"), getAllUsers)
  .post(
    auth,
    allowedTo("admin"),
    uploadUserImage,
    resizeUserImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(auth, allowedTo("admin"), getUserValidator, getUserById)
  .put(
    auth,
    allowedTo("admin"),
    uploadUserImage,
    resizeUserImage,
    updateUserValidator,
    updateUser
  )
  .delete(auth, allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
