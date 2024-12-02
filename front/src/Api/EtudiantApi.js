import axios from "axios";

const BASE_URL = "https://localhost:7031/api";

const EtudiantApi = {
    fetchEtudiants: async () => {
        try {
          // Récupérer le token depuis le localStorage
          const token = localStorage.getItem('jwtToken');  // ou 'userData.token' si vous stockez le token dans 'userData'
    
          // Si le token n'est pas disponible, vous pouvez lancer une erreur ou gérer cela différemment
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
 // Méthode pour récupérer un étudiant par son ID depuis userData
 fetchEtudiantById: async () => {
    try {
      const userData = localStorage.getItem('userData');
      
      // Vérifier que l'userData existe et que le token est présent
      if (!userData) {
        throw new Error("Données utilisateur manquantes");
      }

      const parsedUserData = JSON.parse(userData);
      const token = localStorage.getItem('jwtToken');

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
  }

  

  
};

export default EtudiantApi;
