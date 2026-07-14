const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    payable: { type: Number, required: true },
    cus_details: { type: Array, required: true },
    ship_details: { type: Array, required: true },
    tran_id: { type: String, required: true },
    val_id: { type: String, required: true },
    
    deliver_status: {
      type: String,
      required: true,
      enum: ["pending", "delivered", "cancel"],
      default: "pending", // default value
    },
    
    payment_status: {
      type: String,
      required: true,
      enum: ["pending", "success", "cancel", "fail"],
      default: "pending", // default value
    },
    
    vat: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const invoiceModel = mongoose.model("invoices", DataSchema);

module.exports = invoiceModel;