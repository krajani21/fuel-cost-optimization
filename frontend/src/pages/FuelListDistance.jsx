import React, { useState, useEffect } from 'react';
import { fetchDistanceOnly } from '../api/distanceOnly';

const FuelListDistance = ({ userLocation }) => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    if (userLocation) {
      fetchDistanceOnly(userLocation)
        .then((data) => {
          const sorted = data
            .filter(station => station.distance !== null)
            .sort((a, b) => a.distance - b.distance);

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
        Fuel Stations Sorted by Distance
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
            <strong>{station.station_name}</strong> - {station.address} - ${station.price.toFixed(2)}
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

export default FuelListDistance;
