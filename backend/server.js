const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const distanceRoutes = require("./routes/distanceRoutes");
const volumeBasedRoutes = require("./routes/volumeBasedRoutes")
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

app.use("/api/distances", distanceRoutes);//handle distance calculation logic

app.use("/api/volume-based", volumeBasedRoutes);//handle volume based logic

// Optional root route
app.get("/", (req, res) => {
  res.send("Fuel Cost Optimization API is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
