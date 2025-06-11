// const express = require("express");
// const app = express();
// const PORT = process.env.PORT || 8000;


// const axios = require("axios");

// async function getFuelPrices(){

//     //get the data from the server that is currently running
//     const response = await axios.get("http://127.0.0.1:5000/Alberta/edmonton");
//     return response.data;
// }

// app.get("/", async function(req, res){
//     fuel_prices = await getFuelPrices();
//     res.send(fuel_prices);

// })

// app.listen(PORT, () =>{
//     console.log(`Server is running on port ${PORT}`);
// })

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fuelRoutes = require("./routes/fuelRoutes");
const cors = require("cors");



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());//cors should go after defining the app, it causes an error if placed before

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Route for MongoDB fuel station logic
app.use("/fuelstations", fuelRoutes); // e.g. /fuelstations/cheapest

// Optional root route
app.get("/", (req, res) => {
  res.send("Fuel Cost Optimization API is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
