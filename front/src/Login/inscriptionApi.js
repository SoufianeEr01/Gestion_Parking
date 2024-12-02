import axios from "axios";

const BASE_URL = "https://localhost:7031/api";

const SignApi = {
  fetchGroups: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Group`);
      return response.data; // Retourne la liste des groupes
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes :", error);
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

  createPersonnel: async (personnelData) => {
    try {
      const response = await axios.post(`${BASE_URL}/Personnel`, personnelData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data; // Succès de la création
    } catch (error) {
      console.error("Erreur lors de la création du personnel :", error);
      throw error.response?.data || error.message;
    }
  },

  createLogin: async (loginData) => {
    try {
      const response = await axios.post(`${BASE_URL}/Auth/Login`, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data; // Succès de la connexion
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      throw error.response?.data || error.message;
    }
  },
};

export default SignApi;
