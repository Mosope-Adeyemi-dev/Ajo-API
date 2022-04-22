const Place = require("../models/placeModel");
const { translateError } = require("./mongo_helper");
const axios = require("axios");

const savePlaceDetails = async (placeDetails) => {
  try {
    const newPlace = new Place({
      name: placeDetails.result.name,
      placeType: placeDetails.result.types,
      address: placeDetails.result.formatted_address,
      phone: placeDetails.result.formatted_phone_number,
      internationalPhone: placeDetails.result.international_phone_number,
      rating: placeDetails.result.rating,
      userRatingTotal: placeDetails.result.user_ratings_total,
      googlePlaceId: placeDetails.result.place_id,
      fullSearchResult: placeDetails.result,
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
      url: "https://google-maps28.p.rapidapi.com/maps/api/place/queryautocomplete/json",
      params: { input: query, language: "en" },
      headers: {
        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
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
      url: "https://google-maps28.p.rapidapi.com/maps/api/place/details/json",
      params: {
        fields:
          "address_component,adr_address,business_status,formatted_address,name,permanently_closed,photo,place_id,plus_code,type,url,utc_offset,vicinity,formatted_phone_number,international_phone_number,opening_hours,website,price_level,rating,review,user_ratings_total",
        // eslint-disable-next-line camelcase
        place_id: placeId,
        language: "en",
      },
      headers: {
        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      },
    };
    const result = await axios.request(options);
    if (result) {
      //save search result to DB
      const show = await savePlaceDetails(result.data);
      console.log(show);
      return [true, result.data];
    }
  } catch (error) {
    console.error(error);
    return [false, error];
  }
};

const checkDBForPlace = async (googlePlaceId) =>
  await Place.findOne({ googlePlaceId });

module.exports = {
  getPlaceDetailsByPlaceId,
  savePlaceDetails,
  getQueryPredictions,
  checkDBForPlace,
};
