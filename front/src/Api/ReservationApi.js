import axios from "axios";

const BASE_URL = "https://localhost:7031/api";

const ReservationApi = {
  // Récupérer toutes les réservations
  fetchReservations: async () => {
    try {
      const token = sessionStorage.getItem('jwtToken');

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.get(`${BASE_URL}/Reservation`, {
        headers: {
          'Authorization': `Bearer ${token}` // Ajouter le token dans les en-têtes
        }
      });

      return response.data;  // Retourner les réservations
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
      throw error;
    }
  },

  // Récupérer une réservation par ID
  fetchReservationById: async (id) => {
    try {
      const token = sessionStorage.getItem('jwtToken');

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.get(`${BASE_URL}/Reservation/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Ajouter le token dans les en-têtes
        }
      });

      return response.data;  // Retourner la réservation par ID
    } catch (error) {
      console.error("Erreur lors de la récupération de la réservation :", error);
      throw error;
    }
  },

  // Créer une nouvelle réservation
  createReservation: async (reservationData) => {
    try {
      const token = sessionStorage.getItem('jwtToken');

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.post(`${BASE_URL}/Reservation`, reservationData, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` // Ajouter le token dans les en-têtes
        }
      });

      return response.data; // Retourne la confirmation de la création
    } catch (error) {
      console.error("Erreur lors de la création de la réservation :", error);
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour une réservation
  updateReservation: async (id, reservationData) => {
    try {
      const token = sessionStorage.getItem('jwtToken');

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.put(`${BASE_URL}/Reservation/${id}`, reservationData, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` // Ajouter le token dans les en-têtes
        }
      });

      return response.data; // Retourne la réservation mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réservation :", error);
      throw error.response?.data || error.message;
    }
  },

  // Supprimer une réservation
  deleteReservation: async (id) => {
    try {
      const token = sessionStorage.getItem('jwtToken');

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      await axios.delete(`${BASE_URL}/Reservation/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Ajouter le token dans les en-têtes
        }
      });

      // Rien à retourner, la suppression est réussie
    } catch (error) {
      console.error(`Erreur lors de la suppression de la réservation ${id} :`, error);
      throw error.response?.data || error.message;
    }
  }
};

export default ReservationApi;
