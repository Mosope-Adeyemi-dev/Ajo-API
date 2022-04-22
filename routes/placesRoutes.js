const router = require("express").Router();
const {
  getPlaceDetails,
  queryPlaces,
} = require("../controllers/placeControllers");

router.get("/search", queryPlaces);
router.get("/:placeId", getPlaceDetails);

module.exports = router;
