const multer = require("multer");
const apiError = require("../utils/apiError");
const { v4: uuidv4 } = require("uuid");

const multerOptions = () => {
  multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new apiError("Only Image Allowed", 400), false);
    }
  };

  const multerMemoryStorage = multer.memoryStorage();

  const upload = multer({
    storage: multerMemoryStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });

  return upload;
};

exports.uploadSingleImage = (fieldName) => {
  return multerOptions().single(fieldName);
};

exports.uploadMixOfImages = (arrayOfFields) => {
  return multerOptions().fields(arrayOfFields);
};
