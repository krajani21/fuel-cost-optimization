const express = require("express");

const axios = require("axios");

const PORT = 3000;

const app = express();

async function getFuelPrices(){
    const response = await axios.get("http://127.0.0.1:5000/Alberta/edmonton")

    app.get("/example", function(req, res){
        res.send(response.data);
    });
    
    console.log(`server is running on port ${PORT}`);
    app.listen(PORT);

}

getFuelPrices();

