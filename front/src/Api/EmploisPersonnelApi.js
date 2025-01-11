import axios from 'axios';

// URL de base de votre API
const BASE_URL = "https://localhost:7031/api/EmploiPersonnel";

// Fonction pour récupérer les en-têtes d'authentification
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

const EmploisPersonnelApi = {
  // Créer un emploi personnel
  createEmploiPersonnel: async (emploiData) => {
    try {
      const response = await axios.post(`${BASE_URL}`, emploiData, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'emploi personnel:", error);
      throw error.response?.data || error.message;
    }
  },

  // Générer les emplois pour les administrateurs
  generateEmploiAdministrateurs: async () => {
    try {
      const response = await axios.post(`${BASE_URL}/GenerateEmploiAdministrateurs`, {}, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la génération des emplois pour les administrateurs:", error);
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les emplois d'un personnel spécifique
  getEmploiByPersonnel: async (personnelId) => {
    try {
      const response = await axios.get(`${BASE_URL}/personnel/${personnelId}`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des emplois par personnel:", error);
      throw error.response?.data || error.message;
    }
  },

  getEmploiPersonnels: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/personnel`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des emplois par personnel:", error);
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour un emploi personnel
  updateEmploiPersonnel: async (id, emploiData) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, emploiData, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'emploi personnel:", error);
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un emploi personnel
  deleteEmploiPersonnel: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'emploi personnel:", error);
      throw error.response?.data || error.message;
    }
  }
};

export default EmploisPersonnelApi;
