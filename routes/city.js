const router = require("express").Router();
const {
  createTopCities,
  getTopCities,
} = require("../controllers/cityControllers");

router.post("/top-cities/create", createTopCities);
router.get("/top-cities", getTopCities);

module.exports = router;
