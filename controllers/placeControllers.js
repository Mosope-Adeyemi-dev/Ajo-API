const { responseHandler } = require("../services/responseHandler");
const {
  getQueryPredictions,
  getPlaceDetailsByPlaceId,
  checkDBForPlace,
} = require("../services/placeServices");

//Get details about a particular place
const getPlaceDetails = async (req, res) => {
  if (req.params.placeId == undefined) {
    return responseHandler(res, "Include a valid placeId", 400, true, "");
  }

  //Check if place exists on DB
  const foundPlace = await checkDBForPlace(req.params.placeId);
  console.log(foundPlace, "found place");
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

module.exports = {
  getPlaceDetails,
  queryPlaces,
};
