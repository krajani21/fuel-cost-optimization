const express = require("express");
const router = express.Router();
const FuelStation = require("../models/fuelStation");

router.get("/cheapest", async (req, res) => {
    try{
        const stations = await FuelStation.find({}).sort({ price: 1});//sort by ascending order
        res.json(stations);
    } catch(error){
        console.log("error fetching fuel stations:", error);
        res.status(500).json({message : "internal server error"});
    }
});

module.exports = router;