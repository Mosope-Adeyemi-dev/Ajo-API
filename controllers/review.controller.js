const Review = require("../models/review.model");
const User = require("../models/user.model");
const { translateError } = require("../services/mongo_helper");

exports.submitReview = async (req, res) => {
	try {
		const { content, rating } = req.body;

		const user = await User.findById(req.user._id).exec();

		if (!user) {
			return res
				.status(401)
				.json({ error: "Please signup to submit reviews." });
		}

		const review = new Review({
			user_id: req.user._id,
			content,
			rating,
		});

		await review.save((err, data) => {
			if (err) {
				return res.status(500).json({ error: translateError(err) });
			}

			res.json(data);
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: "Something went wrong! Please try again." });
	}
};

exports.getReviews = async (req, res) => {
	try {
		const reviews = await Review.find().exec();

		res.json(reviews);
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: "Something went wrong! Please try again." });
	}
};
