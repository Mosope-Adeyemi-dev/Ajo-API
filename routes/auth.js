const express = require("express");

const router = express.Router();

const {
	signup,
	signin,
	signout,
	forgotPassword,
	resetPassword,
} = require("../controllers/auth.controller");

const {
	userSignupValidator,
	userSigninValidator,
	resetPasswordValidator,
} = require("../validations/authValidation");
const { runValidation } = require("../validations");
const { requireSignin } = require("../middlewares/authToken");

router.post("/auth/signup", userSignupValidator, runValidation, signup);
router.post("/auth/signin", userSigninValidator, runValidation, signin);
router.post("/auth/signout", requireSignin, signout);
router.post("/auth/forgot_password", forgotPassword);
router.post(
	"/auth/reset_password",
	resetPasswordValidator,
	runValidation,
	resetPassword
);

module.exports = router;
