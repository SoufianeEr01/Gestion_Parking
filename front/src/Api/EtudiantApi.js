import axios from "axios";

const BASE_URL = "https://localhost:7031/api";

const EtudiantApi = {

  fetchEtudiants: async () => {
    try {
      // Récupérer le token depuis le sessionStorage
      const token = sessionStorage.getItem('jwtToken');  // ou 'userData.token' si vous stockez le token dans 'userData'

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      // Effectuer la requête avec le token dans les en-têtes Authorization
      const response = await axios.get(`${BASE_URL}/Etudiant`, {
        headers: {
          'Authorization': `Bearer ${token}`  // Ajouter le token dans les en-têtes
        }
      });
      return response.data;  // Retourne la liste des étudiants
    } catch (error) {
      console.error("Erreur lors de la récupération des étudiants :", error);
      throw error;
    }
  },

  // Nouvelle méthode pour récupérer un étudiant par son ID
  fetchEtudiantById: async () => {
    try {
      const userData = sessionStorage.getItem('userData');

      if (!userData) {
        throw new Error("Données utilisateur manquantes");
      }

      const parsedUserData = JSON.parse(userData);
      const token = sessionStorage.getItem('jwtToken');

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const id = parsedUserData.id;  // Récupérer l'ID de l'utilisateur depuis userData

      const response = await axios.get(`${BASE_URL}/Etudiant/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`  // Ajouter le token dans les en-têtes
        }
      });
      return response.data;  // Retourne l'étudiant correspondant à l'ID
    } catch (error) {
      console.error("Erreur lors de la récupération de l'étudiant par ID :", error);
      throw error;
    }
  },

  createEtudiant: async (etudiantData) => {
    try {
      const response = await axios.post(`${BASE_URL}/Etudiant`, etudiantData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data; // Succès de la création
    } catch (error) {
      console.error("Erreur lors de la création de l'étudiant :", error);
      throw error.response?.data || error.message;
    }
  },

  // Méthode pour mettre à jour un étudiant
  updateEtudiant: async (id, etudiantData) => {
    try {
      const token = sessionStorage.getItem('jwtToken');  // Récupérer le token depuis le sessionStorage

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.put(`${BASE_URL}/Etudiant/${id}`, etudiantData, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`, // Ajouter le token dans les en-têtes
        },
      });

      return response.data; // Retourne les données mises à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'étudiant :", error);
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un groupe
  deleteEtudiant: async (id) => {
    try {
      const token = sessionStorage.getItem('jwtToken');

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      await axios.delete(`${BASE_URL}/Etudiant/${id}`, {
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

export default EtudiantApi;
