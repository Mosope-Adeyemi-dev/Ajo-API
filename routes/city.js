const router = require("express").Router();
const {
  createTopCities,
  getTopCities,
} = require("../controllers/cityController");

router.post("/top-cities/create", createTopCities);
router.get("/top-cities", getTopCities);

module.exports = router;
