const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv").config();
const cors = require("cors"); // Import the CORS middleware
const apiKey = process.env.API_KEY;

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/data", async (req, res) => {
  if (apiKey) {
    try {
      const response = await axios.get(
        "https://api.resrobot.se/v2.1/departureBoard?id=740021716&format=json&accessId=" +
          apiKey
      );

      const filteredDepartures = response.data.Departure.filter((departure) => {
        return departure.name === "Länstrafik -Tunnelbana 14";
      });

      const mappedDepartures = filteredDepartures.map((departure) => ({
        name: departure.name,
        direction: departure.direction,
        time: departure.time,
      }));

      res.json(mappedDepartures);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching data from the API" });
    }
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
