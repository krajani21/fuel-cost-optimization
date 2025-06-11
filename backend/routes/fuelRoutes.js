const express = require("express");
const router = express.Router();
const FuelStation = require("../models/fuelStation");
const fs = require("fs");
const path = require("path")

// router.get("/cheapest", async (req, res) => {
//     try{
//         const stations = await FuelStation.find({}).sort({ price: 1});//sort by ascending order
//         res.json(stations);
//     } catch(error){
//         console.log("error fetching fuel stations:", error);
//         res.status(500).json({message : "internal server error"});
//     }
// });


router.get("/cheapest", (req, res) => {
    const dataPath = path.join(__dirname, "../data/fuel_data.json");
    fs.readFile(dataPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading fuel_data.json:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        try {
            const stations = JSON.parse(data);
            // Sort by price ascending
            stations.sort((a, b) => a.price - b.price);
            res.json(stations);
        } catch (parseError) {
            console.error("Error parsing fuel_data.json:", parseError);
            res.status(500).json({ message: "Internal server error" });
        }
    });
});

module.exports = router;

module.exports = router;