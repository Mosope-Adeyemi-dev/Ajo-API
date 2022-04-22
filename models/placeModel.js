const mongoose = require("mongoose");
const { Schema } = mongoose;
const placesSchema = new Schema(
  {
    name: { type: String, required: true },
    placeType: { type: Array, reuired: true },
    address: { type: String, reuired: true },
    phone: String,
    internationalPhone: String,
    rating: String,
    userRatingTotal: Number,
    googlePlaceId: { type: String, required: true, unique: true },
    fullSearchResult: { type: Object },
  },
  { timestamps: true }
);
const Place = mongoose.model("place", placesSchema);
module.exports = Place;
