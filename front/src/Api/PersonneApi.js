import axios from "axios";

const BASE_URL = "https://localhost:7031/api";

// Fonction pour récupérer les en-têtes d'autorisation
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

// Fonction générique pour gérer les erreurs API
const handleApiError = (error) => {
  console.error(error);
  throw error.response?.data?.message || "Une erreur inattendue est survenue.";
};

// Objet API pour consommer les services
const PersonneApi = {
  fetchAllPersonnes: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Personnes`, {
        headers: getAuthHeaders(),
      });
      return response.data; 
    } catch (error) {
      handleApiError(error);
    }
  },

  fetchPersonnesCount: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Personnes/count`, {
        headers: getAuthHeaders(),
      });
      return response.data.count; 
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default PersonneApi;
