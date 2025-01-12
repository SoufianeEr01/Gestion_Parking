import axios from "axios";

const BASE_URL = "https://localhost:7031/api";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('jwtToken');
  if (!token) {
    throw new Error("Token d'authentification manquant");
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const PaiementApi = {
  // Fonction générique pour effectuer des appels POST
  post: async (url, data) => {
    try {
      const response = await axios.post(url, data, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'appel POST:", error);
      throw error.response?.data || error.message;
    }
  },

  // Fonction générique pour effectuer des appels GET
  get: async (url) => {
    try {
      const response = await axios.get(url, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'appel GET:", error);
      throw error.response?.data || error.message;
    }
  },

  // Fonction pour récupérer tous les paiements
  fetchPaiements: async () => {
    const url = `${BASE_URL}/Paiement`;
    return await PaiementApi.get(url);
  },

  // Fonction pour récupérer un paiement par ID
  fetchPaiementById: async (id) => {
    const url = `${BASE_URL}/Paiement/${id}`;
    return await PaiementApi.get(url);
  },

  // Fonction pour créer un paiement
  createPaiement: async (paiement) => {
    const url = `${BASE_URL}/Paiement`;
    return await PaiementApi.post(url, paiement);
  },
  
};

export default PaiementApi;
