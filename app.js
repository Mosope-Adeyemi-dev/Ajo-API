require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { readdirSync } = require("fs");

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
readdirSync("./routes").map((routeName) => {
	app.use("/api", require(`./routes/${routeName}`));
});

app.get("/", (req, res) => {
	res.send({
		status: "Active",
	});
});

module.exports = app;
