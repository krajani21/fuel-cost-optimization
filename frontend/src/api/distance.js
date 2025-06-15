import axios from "axios";

export const fetchDistances = async (userLocation) => {
  try {
    const response = await axios.post("http://localhost:8000/api/distances", {
      origin: userLocation,
    });
    return response.data; //this contains distances returned by the backend
  } catch (error) {
    console.error("Error fetching distances:", error);
    throw error;
  }
};
