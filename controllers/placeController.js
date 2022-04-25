const { responseHandler } = require("../services/responseHandler");
const {
  getQueryPredictions,
  getPlaceDetailsByPlaceId,
  checkDBForPlace,
  getPopularPlacesByRating,
  getPlacesByCity,
} = require("../services/placeServices");

//Get details about a particular place
const getPlaceDetails = async (req, res) => {
  if (req.params.placeId == undefined) {
    return responseHandler(res, "Include a valid placeId", 400, true, "");
  }

  //Check if place exists on DB
  const foundPlace = await checkDBForPlace(req.params.placeId);
  if (foundPlace) {
    return responseHandler(
      res,
      "Place details retrieved succesfully",
      200,
      false,
      foundPlace["fullSearchResult"]
    );
  }

  // Request from places API if place does not exist
  const check = await getPlaceDetailsByPlaceId(req.params.placeId);
  if (check[0])
    return responseHandler(
      res,
      "Place details retrieved succesfully",
      200,
      false,
      check[1]["result"]
    );

  return responseHandler(res, check[1]["message"], 400, true, "");
};

// Get place predictions as user types
const queryPlaces = async (req, res) => {
  if (req.query.queryText == undefined) {
    return responseHandler(res, "Include a valid query text", 400, true, "");
  }
  const check = await getQueryPredictions(req.query.queryText);
  if (check[0])
    return responseHandler(
      res,
      "Query predictions retrieved succesfully",
      200,
      false,
      check[1]
    );

  return responseHandler(res, check[1]["message"], 400, true, "");
};

const getPopularPlaces = async (req, res) => {
  const foundPlaces = await getPopularPlacesByRating();
  if (foundPlaces.length > 0)
    return responseHandler(
      res,
      "Cities retrieved succesfully",
      200,
      false,
      foundPlaces
    );
  if (foundPlaces.length == 0)
    return responseHandler(
      res,
      "No place matches your query",
      200,
      false,
      foundPlaces
    );
  return responseHandler(res, "Unable to retrieve cities", 400, true, "");
};

const discoverCityPlaces = async (req, res) => {
  if (req.params.city == undefined) {
    return responseHandler(res, "Include a valid city", 400, true, "");
  }
  if (req.query.placeType == undefined) {
    return responseHandler(res, "Include a valid place type", 400, true, "");
  }
  const foundPlaces = await getPlacesByCity(
    req.params.city,
    req.query.placeType
  );
  if (foundPlaces.length > 0)
    return responseHandler(
      res,
      "Places retrieved succesfully",
      200,
      false,
      foundPlaces
    );
  if (foundPlaces.length == 0)
    return responseHandler(
      res,
      "No place matches your query",
      200,
      false,
      foundPlaces
    );
  return responseHandler(res, "Unable to retrieve places", 400, true, "");
};

module.exports = {
  getPlaceDetails,
  getPopularPlaces,
  queryPlaces,
  discoverCityPlaces,
};
