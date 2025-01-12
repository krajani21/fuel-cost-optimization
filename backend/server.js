const axios = require("axios");

async function getFuelPrices(){
    //get the data from the server that is currently running
    const response = await axios.get("http://127.0.0.1:5000/Alberta/edmonton");


}