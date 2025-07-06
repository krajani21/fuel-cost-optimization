import React, { useState, useEffect } from 'react';
import { fetchVolumeBased } from '../api/volumeBased';

const FuelListVolume = ({ userLocation }) => {
  const [stations, setStations] = useState([]);
  const [fuelAmount, setFuelAmount] = useState("");
  const [efficiency, setEfficiency] = useState("");
  const [submittedAmount, setSubmittedAmount] = useState(null);
  const [submittedEfficiency, setSubmittedEfficiency] = useState(null);

  useEffect(() => {
    if (
      userLocation &&
      submittedAmount !== null &&
      submittedEfficiency !== null
    ) {
      fetchVolumeBased(userLocation, submittedAmount, submittedEfficiency)
        .then((data) => {
          const sorted = data
            .filter(station => station.fuel_volume !== null)
            .sort((a, b) => b.fuel_volume - a.fuel_volume);

          setStations(sorted);
        })
        .catch((err) => {
          console.error("Failed to fetch volume-based data:", err);
        });
    }
  }, [userLocation, submittedAmount, submittedEfficiency]);

  const handleSubmit = () => {
    setSubmittedAmount(parseFloat(fuelAmount));
    setSubmittedEfficiency(parseFloat(efficiency));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Fuel Stations by Max Volume (Budget-based)
      </h1>

      {userLocation && (
        <div style={{ marginBottom: "20px" }}>
          <label>
            Enter $ amount:
            <input
              type="number"
              value={fuelAmount}
              onChange={(e) => setFuelAmount(e.target.value)}
              placeholder="e.g. 40"
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "80px",
              }}
            />
          </label>

          <label style={{ marginLeft: "15px" }}>
            Efficiency (L/100km):
            <input
              type="number"
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              placeholder="e.g. 8.5"
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "80px",
              }}
            />
          </label>

          <button
            onClick={handleSubmit}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              borderRadius: "4px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </div>
      )}

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
            <div style={{ fontSize: "0.95em", color: "#333", marginTop: "4px" }}>
              Max Volume: {station.fuel_volume.toFixed(2)} L
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FuelListVolume;
