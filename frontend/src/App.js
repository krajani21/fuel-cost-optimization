import React from 'react';
import FuelList from './pages/fuelList';
import './App.css';

function App() {

  const [userLocation, setUserLocation] = React.useState(null);

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(coords);
        console.log("user location: ", coords);

      },
      error => {
        console.error("Error getting location: ", error);
        alert("Unable to retrieve your location. Please allow location access in your browser settings.");
      }
    );
  };


  return (
    <div className="App">
      <button onClick={handleGetLocation} style = {{marginBottom: "20px", padding: "10px"}}>
        Get location
      </button>
      <FuelList userLocation={userLocation} />
    </div>
  );
}

export default App;
