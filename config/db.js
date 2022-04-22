const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

exports.connectDB = async () => {
	await mongoose
		.connect(uri)
		.then(() => {
			console.log("DB connected.");
		})
		.catch((error) => {
			console.log(error);
			throw new Error(error);
		});
};

exports.closeDBConnection = () => {
	return mongoose.disconnect();
};
