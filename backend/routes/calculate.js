const fs = require("fs");

const data = fs.readFile("fuel_data.json", "utf8", (err, data) => {
    if(err){
        console.log(err);
    }
    console.log(data);
});

