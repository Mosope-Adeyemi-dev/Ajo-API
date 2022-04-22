const mongoose = require("mongoose");
const { Schema } = mongoose;
const citySchema = new Schema(
  {
    city: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
const City = mongoose.model("city", citySchema);
module.exports = City;
