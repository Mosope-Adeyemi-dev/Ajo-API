const express = require("express");

const router = express.Router();

const {
	submitReview,
	getReviews,
} = require("../controllers/review.controller");

const { requireSignin } = require("../middlewares/authToken");
const isVerified = require("../middlewares/isVerified");

router.post("/app/review", requireSignin, isVerified, submitReview);
router.get("/app/reviews", getReviews);

module.exports = router;
