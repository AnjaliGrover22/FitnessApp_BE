const express = require("express");
const app = express();
require("dotenv").config();
require("colors");
const port = process.env.PORT || 8081;
const connectDB = require("./database/dbinit");
connectDB();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to Fitness App!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`.bgGreen.black);
});
