import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FuelListVolume from './pages/FuelListVolume';
import './App.css';
import './styles/global.css'; 
import FuelListDistance from './pages/fuelListDistance';

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
      <div className="App" style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        <button
          onClick={handleGetLocation}
          style={{
            marginBottom: "20px",
            padding: "10px 16px",
            borderRadius: "6px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Get location
        </button>

        <nav className = "nav-links">
          <Link to="/" className="nav-button">Sort by Distance</Link>
          
          <Link to="/volume" className="nav-button">Sort by Max Volume</Link>
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
