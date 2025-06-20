const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name Is Required"],
      unique: [true, "Category Must Be Unique"],
    },
    description: String,
    image: String,
  },
  { timestamps: true }
);
const setImageURL = function (doc) {
  if (doc.image && !doc.image.startsWith("http")) {
    doc.image = `${process.env.BASE_URL}/category/${doc.image}`;
  }
};
categorySchema.post("init", function (doc) {
  setImageURL(doc);
});
categorySchema.post("save", function (doc) {
  setImageURL(doc);
});

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
