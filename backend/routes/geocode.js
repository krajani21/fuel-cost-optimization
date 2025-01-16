const prompt = require('prompt-sync')();
const fs = require("fs");

const data = fs.readFile("fuel_data.json", "utf8", (err, data) => {
    if(err){
        console.log(err);
    }
    console.log(data);
});



const distance = prompt("Enter distance to cheapest fuel station: ");
const refuel_amount = prompt("Enter the amount of liters to refuel: ");


