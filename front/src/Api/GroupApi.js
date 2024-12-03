import axios from "axios";

const BASE_URL = "https://localhost:7031/api";

const GroupApi = {
  // Récupérer tous les groupes
  fetchGroups: async () => {
    try {
      const token = sessionStorage.getItem('jwtToken'); // Récupérer le token depuis le sessionStorage

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.get(`${BASE_URL}/Group`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Ajouter le token dans les en-têtes
        }
      });

      return response.data; // Retourne la liste des groupes
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes :", error);
      throw error;
    }
  },

  // Récupérer un groupe par son ID
  fetchGroupById: async (id) => {
    try {
      const token = sessionStorage.getItem('jwtToken');

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.get(`${BASE_URL}/Group/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      return response.data; // Retourne le groupe correspondant à l'ID
    } catch (error) {
      console.error(`Erreur lors de la récupération du groupe ${id} :`, error);
      throw error;
    }
  },

  // Créer un groupe
  createGroup: async (groupData) => {
    try {
      const token = sessionStorage.getItem('jwtToken');

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.post(`${BASE_URL}/Group`, groupData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      return response.data; // Retourne le groupe créé
    } catch (error) {
      console.error("Erreur lors de la création du groupe :", error);
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour un groupe
  updateGroup: async (id, groupData) => {
    try {
      const token = sessionStorage.getItem('jwtToken');

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.put(`${BASE_URL}/Group/${id}`, groupData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      return response.data; // Retourne le groupe mis à jour
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du groupe ${id} :`, error);
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un groupe
  deleteGroup: async (id) => {
    try {
      const token = sessionStorage.getItem('jwtToken');

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      await axios.delete(`${BASE_URL}/Group/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      // Rien à retourner, la suppression est réussie
    } catch (error) {
      console.error(`Erreur lors de la suppression du groupe ${id} :`, error);
      throw error.response?.data || error.message;
    }
  }
};

export default GroupApi;
