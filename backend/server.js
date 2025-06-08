const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;


const axios = require("axios");

async function getFuelPrices(){

    //get the data from the server that is currently running
    const response = await axios.get("http://127.0.0.1:5000/Alberta/edmonton");
    return response.data;
}

app.get("/", async function(req, res){
    fuel_prices = await getFuelPrices();
    res.send(fuel_prices);

})

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})