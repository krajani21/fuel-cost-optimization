const express = require("express");
const router = express.Router();
const axios = require("axios");
const { calculateEffectiveFuelVolume } = require("../utils/calculate");

router.post("/", async (req, res) => {
  try {
    const { origin, budget, efficiency } = req.body;

    if (!origin || !origin.lat || !origin.lng || typeof budget !== "number" || typeof efficiency !== "number") {
      return res.status(400).json({ error: "Invalid origin, budget, or efficiency" });
    }

    const originString = `${origin.lat},${origin.lng}`;

    // 1. Get Nearby Gas Stations (within 5km)
    const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${originString}&radius=5000&type=gas_station&key=${process.env.GOOGLE_API_KEY}`;
    const nearbyResponse = await axios.get(nearbyUrl);
    const nearbyStations = nearbyResponse.data.results;

    if (!nearbyStations || nearbyStations.length === 0) {
      return res.status(404).json({ error: "No gas stations found nearby." });
    }

    // 2. Get Place Details and Fuel Prices
    const placeDetailsPromises = nearbyStations.map(async (station) => {
      try {
        const detailsUrl = `https://places.googleapis.com/v1/places/${station.place_id}?fields=displayName,formattedAddress,fuelOptions&key=${process.env.GOOGLE_API_KEY}`;
        const detailsRes = await axios.get(detailsUrl);
        const details = detailsRes.data;

        // Check if fuelOptions and fuelPrices are valid
        const prices = details?.fuelOptions?.fuelPrices;
        if (!prices || !Array.isArray(prices)) {
          return null; // Skip station
        }

        const fuelEntry = prices.find(fp => fp.type === "REGULAR_UNLEADED");

        if (!fuelEntry || !fuelEntry.price || fuelEntry.price.units == null || fuelEntry.price.nanos == null) {
          return null;
        }

        // Combine units + nanos into float (e.g. 1.28)
        const priceFloat = parseFloat(`${fuelEntry.price.units}.${Math.round(fuelEntry.price.nanos / 1e6).toString().padStart(3, '0')}`);

        return {
          station_name: details.displayName?.text || "Unknown",
          address: details.formattedAddress || "Unknown",
          price: priceFloat,
        };
      } catch (err) {
        console.warn(`Failed to fetch or parse details for station ${station.name}`, err.message);
        return null;
      }
    });

    const stationsWithPrices = await Promise.all(placeDetailsPromises);
    const filteredStations = stationsWithPrices.filter(station => station !== null && typeof station.price === "number");

    if (filteredStations.length === 0) {
      return res.status(404).json({ error: "No fuel price data found for nearby stations." });
    }

    // 3. Prepare Distance Matrix API call
    const destinations = filteredStations.map((station) => encodeURIComponent(station.address)).join("|");
    const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originString}&destinations=${destinations}&key=${process.env.GOOGLE_API_KEY}`;
    const distanceResponse = await axios.get(distanceUrl);
    const distanceRows = distanceResponse.data.rows;

    if (!distanceRows || !distanceRows[0] || !distanceRows[0].elements) {
      console.error("Invalid Distance Matrix response:", distanceResponse.data);
      return res.status(500).json({ error: "Failed to get distance data from Google API" });
    }

    const distanceData = distanceRows[0].elements;

    // 4. Combine station data with distance and fuel calculations
    const result = filteredStations.map((station, index) => {
      const distanceElement = distanceData[index];

      if (!distanceElement || distanceElement.status !== "OK") {
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
        efficiency: null,
      };

      if (distanceKm !== null && typeof station.price === "number" && typeof budget === "number" && typeof efficiency === "number") {
        try {
          fuelCalc = calculateEffectiveFuelVolume({
            price_per_litre: station.price,
            distance_km: distanceKm,
            budget,
            efficiency_l_per_100km: efficiency,
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
    res.status(500).json({ error: "Failed to calculate distances and fuel data" });
  }
});

module.exports = router;
