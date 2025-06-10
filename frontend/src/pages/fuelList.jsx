import React from 'react';

const FuelList = () => {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/fuelstations/cheapest")
        .then((res) => res.json())
        .then((data) => setStations(data))
        .catch((error) => console.error("Error fetching fuel stations:", error));
    }, []);

    return(
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>Cheapest Fuel Stations</h1>
            <ul>
                {stations.map((station, index) => (
                    <li key = {index} className='mb-2'>
                        <strong>{station.station_name}</strong> - {station.address} - ${station.price} 
                    </li>

                ))}
            </ul>
            
        </div>
    );
};

export default FuelList;