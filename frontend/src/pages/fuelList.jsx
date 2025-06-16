import React, { useState, useEffect } from 'react';
import { fetchDistances } from '../api/distance'; 

const FuelList = ({ userLocation }) => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    // Only call once userLocation is available
    if (userLocation) {
      console.log("User location received:", userLocation);

      fetchDistances(userLocation)
        .then((data) => {
          // Optional: sort by total cost or just distance
          const sorted = data
            .filter(station => station.distance !== null)
            .sort((a, b) => a.distance - b.distance); // sort by shortest distance
          
          setStations(sorted);
        })
        .catch((err) => {
          console.error("Failed to fetch distances:", err);
        });
    }
  }, [userLocation]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Nearby Fuel Stations
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
            <br />
            <span style={{ fontSize: "0.9em", color: "#555" }}>
              Distance: {station.distance_text} ({station.duration_text})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FuelList;
