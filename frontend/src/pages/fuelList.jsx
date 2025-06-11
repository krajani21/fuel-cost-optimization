import React, { useState, useEffect } from 'react';

const FuelList = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/fuelstations/cheapest")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setStations(data);
      })
      .catch((error) => console.error("Error fetching fuel stations:", error));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Cheapest Fuel Stations
      </h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {stations.map((station, index) => (
          <li
            key={index}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <strong>{station.station_name}</strong> - {station.address} - ${station.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FuelList;
