const router = require("express").Router();
const {
	getPlaceDetails,
	getPopularPlaces,
	queryPlaces,
	discoverCityPlaces,
	getSimilarPlaces,
} = require("../controllers/placeController");

// const { requireSignin } = require("../middlewares/authToken");
// const isVerified = require("../middlewares/isVerified");

router.get("/places/auto/search", queryPlaces);
router.get("/places/:placeId", getPlaceDetails);
router.get("/places/search/popular", getPopularPlaces);
router.get("/places/discover/:city", discoverCityPlaces);
router.get("/places/search/similar", getSimilarPlaces);

module.exports = router;
