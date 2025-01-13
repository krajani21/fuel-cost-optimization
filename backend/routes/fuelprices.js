const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");



mongoose.connect("mongodb://localhost:27017");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "mongoDB connection error:"));

db.once("open", async() => {
    console.log("Connected to MongoDB");

    const fuelPriceSchema = new mongoose.Schema({
        address: String,
        last_update: String,
        price: Number,
        station_name: String,

    });

    const fuelPrice = mongoose.model("fuelPrice", fuelPriceSchema);

    const response = await axios.get("http://127.0.0.1:5000/Alberta/edmonton");
    const fuel_data = response.data;
    //await fuelPrice.insertMany(fuel_data);

    fs.writeFile("fuel_data.json", JSON.stringify(fuel_data, null, 2), (err) => {
        if(err){
            console.log(err);
        }
    });

    const prices = await fuelPrice.find({}, {_id: 0, price: 1});
    console.log(prices);
    mongoose.connection.close();
    
});