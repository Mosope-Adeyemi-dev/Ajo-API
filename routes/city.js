const router = require("express").Router();
const {
	createTopCities,
	getTopCities,
} = require("../controllers/cityControllers");

const { requireSignin } = require("../middlewares/authToken");
const isVerified = require("../middlewares/isVerified");

router.post("/top-cities/create", requireSignin, isVerified, createTopCities);
router.get("/top-cities", getTopCities);

module.exports = router;
