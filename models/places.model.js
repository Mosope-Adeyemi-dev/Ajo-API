const mongoose = require("mongoose");
const { Schema } = mongoose;
const placesSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, reuired: true },
    placeType: { type: String, reuired: true },
    image: { type: String, reuired: true },
    address: String,
    phone: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    placeId: String,
  },
  { timestamps: true }
);
const Place = mongoose.model("place", placesSchema);
module.exports = Place;
