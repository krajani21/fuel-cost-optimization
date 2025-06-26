const express = require("express");
const router = express.Router();
const axios = require("axios");

const FLASK_API_URL = "http://localhost:8000/alberta/edmonton";

router.post("/", async (req, res) => {
  try {
    const { origin } = req.body;

    if (!origin || !origin.lat || !origin.lng) {
      return res.status(400).json({ error: "Invalid origin location" });
    }

      //starting point for calculating distance
    const originString = `${origin.lat},${origin.lng}`;

    const city = "Edmonton, AB, Canada";//default city for now can be changed later 

    const stationRes = await axios.get(FLASK_API_URL);
    const stations = stationRes.data;

    //get all destinations to calculate distances to
    const destinations = stations
      .map((station) => encodeURIComponent(`${station.address}, ${city}`))
      .join("|");

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originString}&destinations=${destinations}&key=${process.env.GOOGLE_API_KEY}`;

    const response = await axios.get(url);
    const distanceData = response.data.rows[0].elements;

    //attach distance data to station list
    const result = stations.map((station, index) => ({
      ...station,
      distance: distanceData[index].distance?.value || null,
      distance_text: distanceData[index].distance?.text || null,
      duration: distanceData[index].duration?.value || null,
      duration_text: distanceData[index].duration?.text || null,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error in /api/distances:", error.message);
    res.status(500).json({ error: "Failed to calculate distances" });
  }
});

module.exports = router;
