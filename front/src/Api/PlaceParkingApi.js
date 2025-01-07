import axios from "axios";

const BASE_URL = "https://localhost:7031/api";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("jwtToken");
  if (!token) {
    throw new Error("Token d'authentification manquant");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const handleApiError = (error) => {
  console.error(error);
  throw error.response?.data?.message || "Une erreur inattendue est survenue.";
};

const PlaceParkingApi = {
  fetchPlaceParkings: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/PlaceParking`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  fetchPlaceParkingById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/PlaceParking/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createPlaceParking: async (PlaceParkingData) => {
    try {
      const response = await axios.post(`${BASE_URL}/PlaceParking`, PlaceParkingData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updatePlaceParking: async (id, PlaceParkingData) => {
    try {
      const response = await axios.put(`${BASE_URL}/PlaceParking/${id}`, PlaceParkingData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deletePlaceParking: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/PlaceParking/${id}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      handleApiError(error);
    }
  },
  fetchPlaceParkingsCount: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/PlaceParking/count`, {
        headers: getAuthHeaders(),
      });
      return response.data.count; 
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default PlaceParkingApi;
