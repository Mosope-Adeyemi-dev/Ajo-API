const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.requireSignin = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) return res.status(403).send(err);

      const userExists = await User.findById(user._id).exec();

      if (userExists) {
        req.user = user;
        next();
      } else {
        return res.status(403).send("User does not exist! Please signup.");
      }
    });
  } else {
    res.status(401).send("Unauthorized! Invalid token.");
  }
};
