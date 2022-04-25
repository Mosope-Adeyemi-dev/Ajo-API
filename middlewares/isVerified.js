const User = require("../models/user.model");

const isVerified = async (req, res, next) => {
	const user = await User.findOne({
		$or: [
			{ _id: req.user?._id },
			{ email: req.body?.userId },
			{ username: req.body?.userId },
		],
	}).exec();

	if (!user.verified) {
		return res
			.status(403)
			.json({ error: "Verify your email to use this service." });
	}

	next();
};

module.exports = isVerified;
