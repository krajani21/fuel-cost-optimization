const express = require("express");
const router = express.Router();
const axios = require("axios");
const { calculateEffectiveFuelVolume } = require("../utils/calculate");

const FLASK_API_URL = "http://localhost:8000/alberta/edmonton";

router.post("/", async (req, res) => {
  try {
    const { origin, budget } = req.body;

    if (!origin || !origin.lat || !origin.lng || typeof budget !== "number") {
      return res.status(400).json({ error: "Invalid origin or budget" });
    }

    const originString = `${origin.lat},${origin.lng}`;
    const city = "Edmonton, AB, Canada";

    // Get stations from your Flask API
    const stationRes = await axios.get(FLASK_API_URL);
    const stations = stationRes.data;

    const destinations = stations
      .map((station) => encodeURIComponent(`${station.address}, ${city}`))
      .join("|");

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originString}&destinations=${destinations}&key=${process.env.GOOGLE_API_KEY}`;

    const response = await axios.get(url);
    const distanceRows = response.data.rows;

    if (!distanceRows || !distanceRows[0] || !distanceRows[0].elements) {
      console.error("Invalid Distance Matrix response:", response.data);
      return res.status(500).json({ error: "Failed to get valid distance data from Google API" });
    }

    const distanceData = distanceRows[0].elements;

    const result = stations.map((station, index) => {
      const distanceElement = distanceData[index];

      // Handle bad/missing responses
      if (!distanceElement || distanceElement.status !== "OK") {
        console.warn(`Skipping station [${station.station_name}] due to invalid distance response.`);
        return {
          ...station,
          distance: null,
          distance_text: "N/A",
          duration: null,
          duration_text: "N/A",
          fuel_volume: null,
          travel_cost: null,
          effective_budget: null,
        };
      }

      const distanceMeters = distanceElement.distance?.value;
      const durationSeconds = distanceElement.duration?.value;
      const distanceKm = distanceMeters ? distanceMeters / 1000 : null;

      let fuelCalc = {
        fuel_volume: null,
        travel_cost: null,
        effective_budget: null,
      };

      if (distanceKm !== null && typeof station.price === "number" && typeof budget === "number") {
        try {
          fuelCalc = calculateEffectiveFuelVolume({
            price_per_litre: station.price,
            distance_km: distanceKm,
            budget,
          });
        } catch (err) {
          console.error(`Fuel calculation failed for [${station.station_name}]`, err);
        }
      }

      return {
        ...station,
        distance: distanceMeters,
        distance_text: distanceElement.distance?.text || null,
        duration: durationSeconds,
        duration_text: distanceElement.duration?.text || null,
        fuel_volume: fuelCalc.fuel_volume ? parseFloat(fuelCalc.fuel_volume) : null,
        travel_cost: fuelCalc.travel_cost ? parseFloat(fuelCalc.travel_cost) : null,
        effective_budget: fuelCalc.effective_budget ? parseFloat(fuelCalc.effective_budget) : null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error in /api/distances:", error.message);
    res.status(500).json({ error: "Failed to calculate distances" });
  }
});

module.exports = router;
