const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const FuelStation = require("models/FuelStation");
require("dotenv").config();

const seedData = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    const rawData = fs.readFileSync(path.join(__dirname, "../data/fuel_data.json"));
    const stations = JSON.parse(rawData);

    await FuelStation.deleteMany({}); // Clear existing data
    await FuelStation.insertMany(stations); // Insert new data

    console.log("fuel station data seeses successfully");
    process.exit();

    
    } catch(err){
        console.log("Error seeding data:", err);
        process.exit(1);
    }
};

seedData();