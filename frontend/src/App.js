import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FuelListDistance from './pages/FuelListDistance';
import FuelListVolume from './pages/FuelListVolume';
import './App.css';

function App() {
  const [userLocation, setUserLocation] = useState(null);

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        console.log("user location: ", coords);
      },
      (error) => {
        console.error("Error getting location: ", error);
        alert("Unable to retrieve your location. Please allow location access in your browser settings.");
      }
    );
  };

  return (
    <Router>
      <div className="App" style={{ padding: "20px" }}>
        <button onClick={handleGetLocation} style={{ marginBottom: "20px", padding: "10px" }}>
          Get location
        </button>

        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>Sort by Distance</Link>
          <Link to="/volume">Sort by Max Volume</Link>
        </nav>

        <Routes>
          <Route path="/" element={<FuelListDistance userLocation={userLocation} />} />
          <Route path="/volume" element={<FuelListVolume userLocation={userLocation} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
