// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");
// const { calculateTotalCost } = require("./calculate");
// require("dotenv").config();

// // Load static fuel data
// const fuelData = JSON.parse(
//   fs.readFileSync(path.join(__dirname, "../data/fuel_data.json"))
// );

// // Main function: get distances to stations and calculate total cost
// const getStationEstimates = async (origin) => {
//   try {
//     // Prepare destination addresses for all stations
//     const destinations = fuelData.map((station) => station.address).join("|");

//     // Call Google Maps Distance Matrix API
//     const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;
//     const params = {
//       origins: origin,
//       destinations: destinations,
//       key: process.env.GOOGLE_MAPS_API_KEY,
//       units: "metric",
//     };

//     const response = await axios.get(url, { params });

//     const elements = response.data.rows[0].elements;

//     // For each station, calculate travel distance and total cost
//     const results = fuelData.map((station, index) => {
//       const element = elements[index];

//       if (!element || element.status !== "OK") {
//         return null; // Skip if distance couldn't be calculated
//       }

//       const distance_m = element.distance.value;
//       const distance_km = distance_m / 1000;

//       // Calculate total cost using simplified model
//       const costDetails = calculateTotalCost({
//         price_per_litre: station.price,
//         distance_km,
//       });

//       return {
//         ...station,
//         distance_text: element.distance.text,
//         distance_km: Number(distance_km.toFixed(2)),
//         ...costDetails,
//       };
//     });

//     // Filter out any failed results and sort by total cost
//     const validResults = results.filter(Boolean).sort((a, b) => {
//       return parseFloat(a.total_cost) - parseFloat(b.total_cost);
//     });

//     return validResults;
//   } catch (err) {
//     console.error("Error getting station estimates:", err.message);
//     return [];
//   }
// };

// module.exports = { getStationEstimates };

// directions.js

const { calculateTotalCost } = require('./utils/calculate');

