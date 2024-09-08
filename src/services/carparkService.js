import axios from "axios";

export const fetchCarparks = async (accessToken) => {
  try {
    const response = await axios.get("http://localhost:8000/api/carpark/", {
      headers: { Authorization: "Token " + accessToken },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching carparks:", error);
    throw error;
  }
};

export const createCarpark = async (accessToken, carparkData) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/carpark/create/",
      carparkData,
      {
        headers: { Authorization: "Token " + accessToken },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating carpark:", error);
    throw error;
  }
};

export const updateCarpark = async (id, data) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/api/carparks/${id}/`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error("Carpark update failed");
  }
};

export const deleteCarpark = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:8000/api/carparks/${id}/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Carpark delete failed");
  }
};
