const router = require("express").Router();
const {
  getPlaceDetails,
  getPopularPlaces,
  queryPlaces,
  discoverCityPlaces,
} = require("../controllers/placeControllers");

router.get("/places/auto/search", queryPlaces);
router.get("/places/:placeId", getPlaceDetails);
router.get("/places/search/popular", getPopularPlaces);
router.get("/places/discover/:city", discoverCityPlaces);

module.exports = router;
