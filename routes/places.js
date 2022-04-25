const router = require("express").Router();
const {
	getPlaceDetails,
	getPopularPlaces,
	queryPlaces,
	discoverCityPlaces,
	getSimilarPlaces,
} = require("../controllers/placeControllers");

const { requireSignin } = require("../middlewares/authToken");
const isVerified = require("../middlewares/isVerified");

router.get("/places/auto/search", requireSignin, isVerified, queryPlaces);
router.get("/places/:placeId", requireSignin, isVerified, getPlaceDetails);
router.get("/places/search/popular", getPopularPlaces);
router.get("/places/discover/:city", discoverCityPlaces);
router.get(
	"/places/search/similar",
	requireSignin,
	isVerified,
	getSimilarPlaces
);

module.exports = router;
