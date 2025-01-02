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
};

export default ReservationApi;
