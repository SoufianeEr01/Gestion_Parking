import axios from "axios";

const BASE_URL = "https://localhost:7031/api";

const ContactApi = {
  fetchContacts: async () => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }
      const response = await axios.get(`${BASE_URL}/Contact`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts :", error);
      throw error.response?.data || error.message;
    }
  },

  // Récupérer un contact par ID
  fetchContactById: async (id) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.get(`${BASE_URL}/Contact/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du contact avec l'ID ${id} :`, error);
      throw error.response?.data || error.message;
    }
  },

  // Créer un contact
  createContact: async (contactData) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.post(`${BASE_URL}/Contact`, contactData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du contact :", error);
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour un contact
  updateContact: async (id, contactData) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.put(`${BASE_URL}/Contact/${id}`, contactData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du contact avec l'ID ${id} :`, error);
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un contact
  deleteContact: async (id) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      await axios.delete(`${BASE_URL}/Contact/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Suppression réussie
    } catch (error) {
      console.error(`Erreur lors de la suppression du contact avec l'ID ${id} :`, error);
      throw error.response?.data || error.message;
    }
  },
};

export default ContactApi;
