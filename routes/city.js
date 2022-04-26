const router = require("express").Router();
const {
	createTopCities,
	getTopCities,
} = require("../controllers/cityController");

// const { requireSignin } = require("../middlewares/authToken");
// const isVerified = require("../middlewares/isVerified");

router.post("/top-cities/create", createTopCities);
router.get("/top-cities", getTopCities);

module.exports = router;
