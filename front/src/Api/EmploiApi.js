import axios from "axios";

// URL de base pour l'API
const BASE_URL = "https://localhost:7031/api";

// Fonction pour récupérer les en-têtes d'authentification
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('jwtToken');
  if (!token) throw new Error("Token d'authentification manquant");
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const EmploiApi = {
  // Fonction générique pour effectuer des appels API
  request: async (method, url, data = null) => {
    try {
      const config = { headers: getAuthHeaders() };
      const response = method === 'get' || method === 'delete'
        ? await axios[method](url, config)
        : await axios[method](url, data, config);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'appel ${method.toUpperCase()}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Appels API spécifiques
  fetchEmploisByGroupe: (groupeId) => EmploiApi.request('get', `${BASE_URL}/Emplois/group/${groupeId}`),
  createEmploi: (emploiData) => EmploiApi.request('post', `${BASE_URL}/Emplois`, emploiData),
  fetchEmploiByJour: (jour) => EmploiApi.request('get', `${BASE_URL}/Emplois/${jour}`),
  fetchEmploiByIdEtudiant: (idEtudiant) => EmploiApi.request('get', `${BASE_URL}/Emplois/etudiant/${idEtudiant}`),
  updateEmploi: (jour, emploiData) => EmploiApi.request('put', `${BASE_URL}/Emplois/${jour}`, emploiData),
  deleteEmploi: (jour, confirm) => EmploiApi.request('delete', `${BASE_URL}/Emplois/${jour}?confirm=${confirm}`),
};

export default EmploiApi;
