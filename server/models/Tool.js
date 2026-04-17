const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: "general" },
  description: { type: String },
  image: { type: String },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
}, { timestamps: true });

module.exports = mongoose.model("Tool", toolSchema);
