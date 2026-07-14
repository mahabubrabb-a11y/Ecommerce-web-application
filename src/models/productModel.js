const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
  {
    title: { type: String },
    images: [String],
    sort_description: { type: String },
    price: { type: Number },
    is_discount: { type: Boolean },
    discount_price: { type: Number },
    remark: { type: String },
    stock: { type: Number },
    color: [String],
    size: [String],
    description: { type: String },

    // Relationships (Relational Fields)
    category_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    brand_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const productModel = mongoose.model("products", DataSchema);

module.exports = productModel;