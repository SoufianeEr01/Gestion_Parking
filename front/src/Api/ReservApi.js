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
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
      throw error.response?.data || error.message;
    }
  },

  // Récupérer une réservation par ID
  fetchReservationById_personne: async (id_personne) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.get(`${BASE_URL}/Reservation/${id_personne}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la réservation avec l'ID ${id_personne} :`, error);
      throw error.response?.data || error.message;
    }
  },

  // Créer une réservation
  createReservation: async (reservationData) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axios.post(`${BASE_URL}/Reservation`, reservationData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la réservation avec l'ID ${id} :`, error);
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
          'Authorization': `Bearer ${token}`,
        },
      });
      // Suppression réussie
    } catch (error) {
      console.error(`Erreur lors de la suppression de la réservation avec l'ID ${id} :`, error);
      throw error.response?.data || error.message;
    }
  },
};

export default ReservationApi;
