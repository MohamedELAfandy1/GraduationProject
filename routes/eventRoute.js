const express = require("express");
const {
  getEventValidator,
  updateEventValidator,
  deleteEventValidator,
  createEventValidator,
  handleObjects
} = require("../utils/validators/eventValidator.js");

const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  uploadEventImages,
  resizeEventImages
} = require("../controllers/eventController.js");

const { auth, allowedTo } = require("../controllers/authController.js");

const router = express.Router();
router
  .route("/")
  .get(getEvents)
  .post(
    auth,
    allowedTo("admin"),
    uploadEventImages,
    resizeEventImages,
    handleObjects,
    createEventValidator,
    createEvent
  );

router
  .route("/:id")
  .get(getEventValidator, getEvent)
  .put(
    auth,
    allowedTo("admin"),
    uploadEventImages,
    resizeEventImages,
    handleObjects,
    updateEventValidator,
    updateEvent
  )
  .delete(
    auth,
    allowedTo("admin"),
    deleteEventValidator,
    deleteEvent
  );


module.exports = router;
