import axios from "axios";

export const fetchDistances = async (userLocation, budget) => {
  try {
    const response = await axios.post("http://localhost:5000/api/distances", {
      origin: userLocation,
      budget: budget,
    });
    return response.data;//this contains distances returned by the backend
  } catch (error) {
    console.error("Error fetching distances:", error);
    throw error;
  }
};
