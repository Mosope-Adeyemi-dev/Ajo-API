const { responseHandler } = require("../services/responseHandler");
const {
  createTopCitiesValidation,
} = require("../validations/placesValidation");
const { saveCity, alltopCities } = require("../services/placeServices");

const createTopCities = async (req, res) => {
  const { details } = await createTopCitiesValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, true, "");
  }
  const check = await saveCity(req.body.city);
  if (check[0])
    return responseHandler(res, "City added succesfully", 200, false, check[1]);

  return responseHandler(res, check[1], 400, true, "");
};

const getTopCities = async (req, res) => {
  const foundCities = await alltopCities();
  if (foundCities)
    return responseHandler(
      res,
      "Cities retrieved succesfully",
      200,
      false,
      foundCities
    );
  return responseHandler(res, "Unable to retrieve cities", 400, true, "");
};

module.exports = {
  getTopCities,
  createTopCities,
};
