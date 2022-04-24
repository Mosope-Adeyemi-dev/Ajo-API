const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		firstname: {
			type: String,
		},
		lastname: {
			type: String,
		},
		about: {
			type: String,
			maxlength: 250,
		},
		photo: {
			type: String,
			default: "/avatar.png",
		},
		reset_password_pin: {
			type: String,
			default: "",
		},
		reset_pin_expiry: {
			type: Date,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
