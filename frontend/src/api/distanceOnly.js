import axios from 'axios';

export const fetchDistanceOnly = async (origin) => {
  const response = await axios.post("http://localhost:5000/api/distances-only", {
    origin
  });
  return response.data;
};
