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

    const stationRes = await axios.get(FLASK_API_URL);
    const stations = stationRes.data;

    const destinations = stations
      .map((station) => encodeURIComponent(`${station.address}, ${city}`))
      .join("|");

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originString}&destinations=${destinations}&key=${process.env.GOOGLE_API_KEY}`;

    const response = await axios.get(url);
    const distanceData = response.data.rows[0].elements;

    const result = stations.map((station, index) => {
      const distanceMeters = distanceData[index].distance?.value;
      const distanceKm = distanceMeters ? distanceMeters / 1000 : null;

      let fuelCalc = null;

      if (distanceKm !== null) {
        fuelCalc = calculateEffectiveFuelVolume({
          price_per_litre: station.price,
          distance_km: distanceKm,
          budget,
        });
      }

      return {
        ...station,
        distance: distanceMeters,
        distance_text: distanceData[index].distance?.text || null,
        duration: distanceData[index].duration?.value || null,
        duration_text: distanceData[index].duration?.text || null,
        travel_cost: fuelCalc?.travel_cost || null,
        effective_budget: fuelCalc?.effective_budget || null,
        fuel_volume: fuelCalc?.fuel_volume || null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error in /api/distances:", error.message);
    res.status(500).json({ error: "Failed to calculate distances" });
  }
});

module.exports = router;
