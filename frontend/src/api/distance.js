import axios from "axios";

export const fetchDistances = async (userLocation, budget, efficiency) => {
  try {
    const response = await axios.post("http://localhost:5000/api/distances", {
      origin: userLocation,
      budget,
      efficiency,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching distances:", error);
    throw error;
  }
};
