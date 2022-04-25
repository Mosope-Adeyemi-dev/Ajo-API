/* eslint-disable no-unused-vars */
const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../services/auth");
const { generateFromEmail } = require("unique-username-generator");
const { translateError } = require("../services/mongo_helper");
const jwt = require("jsonwebtoken");
const transporter = require("../config/email");

exports.signup = async (req, res) => {
	try {
		const { email, firstname, lastname, password } = req.body;

		const username = generateFromEmail(email, 4);

		const hashedPassword = await hashPassword(password);

		const userExists = await User.findOne({
			$or: [{ email }, { username }],
		}).exec();

		if (userExists) {
			if (userExists.email === email) {
				return res.status(400).json({ error: "Email already taken!" });
			}

			if (userExists.username === username) {
				return res
					.status(400)
					.json({ error: "Username already taken!" });
			}
		}

		const token = jwt.sign({ email }, process.env.JWT_ACCOUNT_ACTIVATION, {
			expiresIn: "10m",
		});

		const msg = {
			from: process.env.MAIL_USERNAME,
			to: email,
			subject: "Verify your Account",
			html: `
			<h1>Ajo</h1>
			<p>Please use the following link to verify your acccount.
			<br/>The link expires in 10 minutes.</p>
            <a>${process.env.CLIENT_URL}/auth/verify?token=${token}</a>
            <hr />
            <footer>This email may contain sensitive information</footer>
		`,
		};

		const user = new User({
			email,
			username,
			firstname,
			lastname,
			password: hashedPassword,
		});

		user.save((err, user) => {
			if (err) {
				return res.status(401).json({
					error: translateError(err),
				});
			}

			transporter.sendMail(msg, (err, info) => {
				if (err) {
					return res.status(502).json({ error: err });
				}

				return res.status(200).json({
					message: `Signup successful! Please verify your email, ${info.accepted[0]}`,
				});
			});
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: "Something went wrong! Please try again." });
	}
};

// Update database with email verification status.
exports.emailVerified = (req, res) => {
	try {
		const { token } = req.body;

		if (token) {
			jwt.verify(
				token,
				process.env.JWT_ACCOUNT_ACTIVATION,
				(error, decoded) => {
					if (error) {
						return res.status(401).json({
							error: "Expired link! Please signup again.",
						});
					}

					const { email } = decoded;

					User.updateOne(
						{ email },
						{ $set: { verified: true } },
						{ new: true }
					).exec();

					res.json({ message: "Email verified!" });
				}
			);
		} else {
			return res.json({ error: "Invalid token. Try again" });
		}
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: "Something went wrong! Please try again." });
	}
};

exports.signin = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email }).exec();

		if (!user) {
			return res.status(400).json({
				error: "User with that email does not exist! Please signup!",
			});
		}
		// authenticate the entered password
		const verifyPassword = await comparePassword(password, user.password);
		if (!verifyPassword) {
			return res.status(401).json({
				error: "Email and password do not match.",
			});
		}
		// generate a token and send as cookie to client
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});

		user.password = undefined;
		user.reset_password_pin = undefined;

		res.cookie("token", token, { expiresIn: "1d" });

		return res.json({
			token,
			user,
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: "Something went wrong! Please try again." });
	}
};

exports.signout = (req, res) => {
	res.clearCookie("token");
	res.status(200).send("Signout success!");
};

exports.forgotPassword = async (req, res) => {
	try {
		const { userId } = req.body;

		const user = await User.findOne({
			$or: [{ email: userId }, { username: userId }],
		}).exec();

		if (!user) {
			return res
				.status(401)
				.json({ error: "User not found! Please signup" });
		}

		// credentials to reset password
		const resetPin = Math.floor(100000 + Math.random() * 900000);
		const pinExpiry = new Date().getTime() + 10 * 60000;

		const msg = {
			from: process.env.MAIL_USERNAME,
			to: user.email,
			subject: "Reset your password",
			html: `
      <h1>Ajo</h1>
      <p>Please use the following pin to reset your password.
      <br/>The pin expires in 10 minutes.</p>
      <h2 style="text-align: center">${resetPin}</h2>
      <p>You can use the link below to go directly to the reset password page.</p>
      <a>${process.env.CLIENT_URL}/auth/reset</a>
      <hr />
      <footer>This email may contain sensitive information</footer>
    `,
		};

		return User.updateOne(
			{ _id: user._id },
			{ reset_password_pin: resetPin, reset_pin_expiry: pinExpiry }
		).exec((err, success) => {
			if (err) {
				return res.status(500).json({ error: translateError(err) });
			} else {
				transporter.sendMail(msg, (err, info) => {
					if (err) {
						return res.status(502).json({ error: err });
					}

					return res.status(200).json({
						message: `Email successfully sent to ${info.accepted[0]}`,
					});
				});
			}
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: "Something went wrong! Please try again." });
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { resetPin, password } = req.body;

		const user = await User.findOne({
			reset_password_pin: resetPin,
		}).exec();

		if (!user) return res.status(401).json({ error: "Incorrect pin!" });

		const currentTime = new Date().getTime();

		if (currentTime > user.reset_pin_expiry) {
			return res.status(400).json({ error: "Expired pin!" });
		}

		const hashedPassword = await hashPassword(password);

		return User.updateOne(
			{ _id: user._id },
			{
				password: hashedPassword,
				reset_password_pin: "",
				reset_pin_expiry: "",
			}
		).exec((err, success) => {
			if (err) {
				return res.status(500).json({ error: translateError(err) });
			}

			res.json({ message: "Password changed successfully." });
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: "Something went wrong! Please try again." });
	}
};

// Email verification
exports.verifyEmail = async (req, res) => {
	try {
		const { email } = req.body;

		const token = jwt.sign({ email }, process.env.JWT_ACCOUNT_ACTIVATION, {
			expiresIn: "10m",
		});

		const msg = {
			from: process.env.MAIL_USERNAME,
			to: email,
			subject: "Verify your Account",
			html: `
			<h1>Ajo</h1>
			<p>Please use the following link to verify your acccount.
			<br/>The link expires in 10 minutes.</p>
            <a>${process.env.CLIENT_URL}/auth/verify?token=${token}</a>
            <hr />
            <footer>This email may contain sensitive information</footer>
		`,
		};

		transporter.sendMail(msg, (err, info) => {
			if (err) {
				return res.status(502).json({ error: err });
			}

			return res.status(200).json({
				message: `Verification email sent to ${info.accepted[0]}`,
			});
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: "Something went wrong! Please try again." });
	}
};
