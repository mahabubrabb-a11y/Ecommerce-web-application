const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
  {
    category_name: { type: String, unique: true, required: true },
    category_img: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const categoryModel = mongoose.model("categories", DataSchema);

module.exports = categoryModel;



