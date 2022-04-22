const Joi = require("joi");

const createPlaceValidation = async (field) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    placeType: Joi.string().required(),
    image: Joi.string().required(),
    address: Joi.string(),
    phone: Joi.string(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    placeId: Joi.string(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

const createTopCitiesValidation = async (field) => {
  const schema = Joi.object({
    city: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

module.exports = {
  createPlaceValidation,
  createTopCitiesValidation,
};
