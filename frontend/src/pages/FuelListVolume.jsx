import React, { useState, useEffect } from 'react';
import { fetchVolumeBased } from '../api/volumeBased';
import '../styles/FuelList.css';

const FuelListVolume = ({ userLocation }) => {
  const [stations, setStations] = useState([]);
  const [fuelAmount, setFuelAmount] = useState("");
  const [efficiency, setEfficiency] = useState("");
  const [submittedAmount, setSubmittedAmount] = useState(null);
  const [submittedEfficiency, setSubmittedEfficiency] = useState(null);

  useEffect(() => {
    if (userLocation && submittedAmount !== null && submittedEfficiency !== null) {
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
    <div className="page-container">
      <h1 className="heading">Fuel Stations by Max Volume (Budget-based)</h1>

      {userLocation && (
        <div className="input-group">
          <label>
            $ Amount:
            <input
              type="number"
              value={fuelAmount}
              onChange={(e) => setFuelAmount(e.target.value)}
              placeholder="e.g. 40"
            />
          </label>

          <label>
            Efficiency (L/100km):
            <input
              type="number"
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              placeholder="e.g. 8.5"
            />
          </label>

          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      <ul className="station-list">
        {stations.map((station, index) => (
          <li key={index} className="station-card">
            <strong>{station.station_name}</strong> - {station.address} - ${station.price.toFixed(2)}
            <div className="station-meta">
              Distance: {station.distance_text} ({station.duration_text})
            </div>
            <div className="station-volume">
              Max Volume: {station.fuel_volume.toFixed(2)} L
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FuelListVolume;
