require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");

const app = express();

// middlewares
app.use(cors());
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
		documentation:
			"https://documenter.getpostman.com/view/14641305/UyrAFcQu",
	});
});

module.exports = app;
