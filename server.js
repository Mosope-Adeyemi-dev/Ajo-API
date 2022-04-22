require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 4000;

// Middewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Database Configuration
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (e) => {
    e
      ? console.log(`Error connecting to database /n ${e}`)
      : console.log(`Successfully connected to the database`);
  }
);

// Server test status
app.get("/", (req, res) => {
  res.send({
    status: "Active",
  });
});

// Routes
app.use("/api/v1/places/", require("./routes/placesRoutes"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
