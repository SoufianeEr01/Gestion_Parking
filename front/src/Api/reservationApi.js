import axios from "axios";

const BASE_URL = "https://localhost:7031/api";

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

const ReservationApi = {
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

  // Fonction pour obtenir les prévisualisations de réservation mensuelle
  previewReservationMensuelle: async (groupeId, placeParkingId, reservationRequest) => {
    const url = `${BASE_URL}/reservation/ReservationMensuelle/Previsualiser/${groupeId}/${placeParkingId}`;
    return await ReservationApi.post(url, reservationRequest);
  },

  // Fonction pour confirmer les réservations mensuelles
  confirmReservationMensuelle: async (reservations) => {
    const url = `${BASE_URL}/reservation/ReservationMensuelle/Confirmer`;
    return await ReservationApi.post(url, reservations);
  },

  // Fonction pour obtenir les prévisualisations de réservation hebdomadaire
  previewReservationHebdomadaire: async (groupeId, placeParkingId, reservationRequest) => {
    const url = `${BASE_URL}/reservation/ReservationHebdomadaire/Previsualiser/${groupeId}/${placeParkingId}`;
    return await ReservationApi.post(url, reservationRequest);
  },

  // Fonction pour confirmer les réservations hebdomadaires
  confirmReservationHebdomadaire: async (reservations) => {
    const url = `${BASE_URL}/reservation/ReservationHebdomadaire/Confirmer`;
    return await ReservationApi.post(url, reservations);
  },

  // Fonction pour obtenir les prévisualisations de réservation semestrielle
  previewReservationSemestrielle: async (groupeId, placeParkingId, reservationRequest) => {
    const url = `${BASE_URL}/reservation/ReservationSemestrielle/Previsualiser/${groupeId}/${placeParkingId}`;
    return await ReservationApi.post(url, reservationRequest);
  },

  // Fonction pour confirmer les réservations semestrielles
  confirmReservationSemestrielle: async (reservations) => {
    const url = `${BASE_URL}/reservation/ReservationSemestrielle/Confirmer`;
    return await ReservationApi.post(url, reservations);
  },
  fetchReservations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Reservation`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      throw error.response?.data || "Erreur inconnue";
    }
  },
  createReservation: async (reservation) => {
    return await ReservationApi.post(`${BASE_URL}/Reservation`, reservation);
  },
  updateReservation: async (id, reservation) => {
    try {
      const response = await axios.put(`${BASE_URL}/Reservation/${id}`, reservation, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réservation:", error);
      throw error.response?.data || "Erreur inconnue";
    }
  },
  deleteReservation: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/Reservation/${id}`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de la réservation:", error);
      throw error.response?.data || "Erreur inconnue";
    }
  },
  fetchReservationById_personne: async (id_personne) => {
    try {
      const response = await axios.get(`${BASE_URL}/Reservation/${id_personne}`,  { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la réservation avec l'ID du persoone ${id_personne} :`, error);
      throw error.response?.data || "Erreur inconnue";
    }
  },
};

export default ReservationApi;
