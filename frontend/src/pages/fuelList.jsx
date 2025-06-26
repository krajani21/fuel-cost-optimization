import React, { useState, useEffect } from 'react';
import { fetchDistances } from '../api/distance';

const FuelList = ({ userLocation }) => {
  const [stations, setStations] = useState([]);
  const [originalStations, setOriginalStations] = useState([]);
  const [fuelAmount, setFuelAmount] = useState("");
  const [sortBy, setSortBy] = useState("distance");

  useEffect(() => {
    if (userLocation) {
      const budget = parseFloat(fuelAmount) || 0;

      fetchDistances(userLocation, budget)
        .then((data) => {
          const converted = data.map(station => ({
            ...station,
            price: station.price / 100,
            fuel_volume: station.fuel_volume ? parseFloat(station.fuel_volume) : null,
          }));

          const sorted = converted
            .filter(station => station.distance !== null)
            .sort((a, b) => a.distance - b.distance);

          setStations(sorted);
          setOriginalStations(sorted);
        })
        .catch((err) => {
          console.error("Failed to fetch distances:", err);
        });
    }
  }, [userLocation, fuelAmount]);

  const toggleSort = () => {
    if (sortBy === "distance") {
      setSortBy("volume");
      sortByVolume();
    } else {
      setSortBy("distance");
      setStations([...originalStations]);
    }
  };

  const sortByVolume = () => {
    const sorted = [...originalStations]
      .filter(station => station.fuel_volume !== null)
      .sort((a, b) => b.fuel_volume - a.fuel_volume);
    setStations(sorted);
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setFuelAmount(val);

    if (userLocation) {
      fetchDistances(userLocation, parseFloat(val) || 0)
        .then((data) => {
          const converted = data.map(station => ({
            ...station,
            price: station.price / 100,
            fuel_volume: station.fuel_volume ? parseFloat(station.fuel_volume) : null,
          }));

          const sorted = converted
            .filter(station => station.fuel_volume !== null)
            .sort((a, b) => b.fuel_volume - a.fuel_volume);

          setStations(sorted);
          setOriginalStations(sorted);
        })
        .catch((err) => {
          console.error("Failed to fetch updated stations:", err);
        });
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Nearby Fuel Stations
      </h1>

      {userLocation && (
        <div style={{ marginBottom: "20px" }}>
          <button onClick={toggleSort} style={{ marginRight: "15px", padding: "6px 10px" }}>
            Sort by: {sortBy === "distance" ? "Distance" : "Max Volume"}
          </button>
          {sortBy === "volume" && (
            <label>
              Enter $ amount:
              <input
                type="number"
                value={fuelAmount}
                onChange={handleAmountChange}
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
          )}
        </div>
      )}

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {stations.map((station, index) => {
          const volume =
            fuelAmount && sortBy === "volume" && station.fuel_volume
              ? station.fuel_volume.toFixed(2)
              : null;

          return (
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
              {volume && (
                <div style={{ fontSize: "0.95em", color: "#333", marginTop: "4px" }}>
                  Max Volume: {volume} L
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FuelList;
