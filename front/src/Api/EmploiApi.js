import axios from "axios";

// URL de base pour l'API
const BASE_URL = "https://localhost:7031/api";

// Fonction pour récupérer les en-têtes d'authentification
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('jwtToken');
  if (!token) {
    throw new Error("Token d'authentification manquant");
  }
  return {
    'Authorization': `Bearer ${token}`, // Use backticks here
    'Content-Type': 'application/json',
  };
};


const EmploiApi = {
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

  // Fonction générique pour effectuer des appels PUT
  put: async (url, data) => {
    try {
      const response = await axios.put(url, data, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'appel PUT:", error);
      throw error.response?.data || error.message;
    }
  },

  // Fonction générique pour effectuer des appels DELETE
  delete: async (url) => {
    try {
      await axios.delete(url, { headers: getAuthHeaders() });
    } catch (error) {
      console.error("Erreur lors de l'appel DELETE:", error);
      throw error.response?.data || error.message;
    }
  },
// Récupérer les emplois par groupe
fetchEmploisByGroupe: (groupeId) => {
  return EmploiApi.get(`${BASE_URL}/Emplois/group/${groupeId}`); // Use backticks
},

// Créer un emploi
createEmploi: (emploiData) => {
  return EmploiApi.post(`${BASE_URL}/Emplois`, emploiData); // Use backticks
},

// Récupérer un emploi par jour
fetchEmploiByJour: (jour) => {
  return EmploiApi.get(`${BASE_URL}/Emplois/${jour}`); // Fix incorrect backticks
},

// Récupérer les emplois par étudiant
fetchEmploiByIdEtudiant: (idEtudiant) => {
  return EmploiApi.get(`${BASE_URL}/Emplois/etudiant/${idEtudiant}`); // Use backticks
},

// Mettre à jour un emploi
updateEmploi: (jour, emploiData) => {
  return EmploiApi.put(`${BASE_URL}/Emplois/${jour}`, emploiData); // Use backticks
},

// Supprimer un emploi
deleteEmploi: (jour, confirm) => {
  return EmploiApi.delete(`${BASE_URL}/Emplois/${jour}?confirm=${confirm}`); // Use backticks
}

};

export default EmploiApi;