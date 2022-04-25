const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const reviewSchema = new mongoose.Schema(
	{
		user_id: {
			type: ObjectId,
			ref: "User",
			required: [true, "id of user is required!"],
		},
		content: {
			type: String,
			minlength: 15,
			maxlength: 250,
			required: true,
		},
		rating: {
			type: Number,
			max: 5,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
