import axios from "axios";

const BASE_URL = "https://localhost:7031/api";

const AdminApi = {
  // Récupérer tous les administrateurs
  fetchAdmins: async () => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.get(`${BASE_URL}/Admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des administrateurs :", error);
      throw error.response?.data || error.message;
    }
  },

  // Récupérer un administrateur par ID
  fetchAdminById: async (id) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.get(`${BASE_URL}/Admin/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'administrateur avec l'ID ${id} :`, error);
      throw error.response?.data || error.message;
    }
  },

  // // Créer un administrateur
  // createAdmin: async (adminData) => {
  //   try {
  //     const token = sessionStorage.getItem('jwtToken');
  //     if (!token) {
  //       throw new Error("Token d'authentification manquant");
  //     }

  //     const response = await axios.post(`${BASE_URL}/Admin`, adminData, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Erreur lors de la création de l'administrateur :", error);
  //     throw error.response?.data || error.message;
  //   }
  // },

  // Mettre à jour un administrateur
  updateAdmin: async (id, adminData) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.put(`${BASE_URL}/Admin/${id}`, adminData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'administrateur avec l'ID ${id} :`, error);
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un administrateur
  deleteAdmin: async (id) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      await axios.delete(`${BASE_URL}/Admin/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Suppression réussie
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'administrateur avec l'ID ${id} :`, error);
      throw error.response?.data || error.message;
    }
  },
};

export default AdminApi;
