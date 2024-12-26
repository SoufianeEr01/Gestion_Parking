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

const PersonnelApi = {
  fetchPersonnels: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Personnel`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  fetchPersonnelById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/Personnel/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createPersonnel: async (PersonnelData) => {
    try {
      const response = await axios.post(`${BASE_URL}/Personnel`, PersonnelData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updatePersonnel: async (id, PersonnelData) => {
    try {
      const response = await axios.put(`${BASE_URL}/Personnel/${id}`, PersonnelData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deletePersonnel: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/Personnel/${id}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default PersonnelApi;
