const Place = require("../models/placeModel");
const { translateError } = require("./mongo_helper");
const axios = require("axios");
const City = require("../models/cityModel");

const savePlaceDetails = async (placeDetails) => {
  try {
    const searchResult = placeDetails.result;
    const newPlace = new Place({
      name: searchResult.name,
      placeType: searchResult.types,
      address: searchResult.formatted_address,
      phone: searchResult.formatted_phone_number,
      internationalPhone: searchResult.international_phone_number,
      rating: searchResult.rating,
      userRatingTotal: searchResult.user_ratings_total,
      googlePlaceId: searchResult.place_id,
      fullSearchResult: searchResult,
    });
    if (await newPlace.save()) {
      return [true, newPlace];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const getQueryPredictions = async (query) => {
  try {
    const options = {
      method: "GET",
      url: `${process.env.GOOGLE_PLACES_API_HOST}/maps/api/place/queryautocomplete/json`,
      params: {
        input: query,
        language: "en",
        key: process.env.GOOGLE_PLACES_API_KEY,
      },
    };
    const result = await axios.request(options);
    if (result) return [true, result.data];
  } catch (error) {
    console.error(error);
    return [false, error];
  }
};

const getPlaceDetailsByPlaceId = async (placeId) => {
  try {
    const options = {
      method: "GET",
      url: `${process.env.GOOGLE_PLACES_API_HOST}/maps/api/place/details/json`,
      params: {
        fields:
          "address_component,adr_address,business_status,formatted_address,name,permanently_closed,photo,place_id,type,url,utc_offset,vicinity,formatted_phone_number,international_phone_number,opening_hours,website,price_level,rating,review,user_ratings_total",
        place_id: placeId,
        language: "en",
        key: process.env.GOOGLE_PLACES_API_KEY,
      },
    };
    const result = await axios.request(options);
    if (result) {
      //save search result to DB
      await savePlaceDetails(result.data);
      return [true, result.data];
    }
  } catch (error) {
    console.error(error);
    return [false, error];
  }
};

const checkDBForPlace = async (googlePlaceId) =>
  await Place.findOne({ googlePlaceId });

const saveCity = async (city) => {
  try {
    const newCity = new City({
      city,
    });
    if (await newCity.save()) return [true, newCity];
  } catch (error) {
    return [false, translateError(error)];
  }
};

const alltopCities = async () => await City.find({});

const getPopularPlacesByRating = async () =>
  await Place.find({ rating: { $gt: 4.0 } })
    .sort({ rating: -1 })
    .limit(15)
    .select("fullSearchResult");

const getPlacesByCity = async (city, placeType) =>
  await Place.find({
    address: { $regex: `${city}`, $options: "i" },
    rating: { $gt: 4.0 },
    placeType,
  })
    .sort({ rating: -1 })
    .limit(30)
    .select("fullSearchResult");

const getPlacesByPlaceType = async (placeType) =>
  await Place.find({ placeType })
    .sort({ rating: -1 })
    .limit(5)
    .select("fullSearchResult");

module.exports = {
  getPlaceDetailsByPlaceId,
  getPopularPlacesByRating,
  savePlaceDetails,
  getQueryPredictions,
  checkDBForPlace,
  saveCity,
  alltopCities,
  getPlacesByCity,
  getPlacesByPlaceType,
};
