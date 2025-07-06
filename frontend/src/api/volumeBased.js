import axios from 'axios';

export const fetchVolumeBased = async (origin, budget, efficiency) => {
  const response = await axios.post("http://localhost:5000/api/volume-based", {
    origin,
    budget,
    efficiency
  });
  return response.data;
};
