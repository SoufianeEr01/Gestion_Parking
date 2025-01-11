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

const ReservationPersonnelApi = {
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
  previewReservationMensuelleP: async (personnelId, placeParkingId, reservationRequest) => {
    const url = `${BASE_URL}/reservation/ReservationMensuelleP/Previsualiser/${personnelId}/${placeParkingId}`;
    return await ReservationPersonnelApi.post(url, reservationRequest);
  },

  // // Fonction pour confirmer les réservations mensuelles
  // confirmReservationMensuelleP: async (reservations) => {
  //   const url = `${BASE_URL}/reservation/ReservationMensuelleP/Confirmer`;
  //   return await ReservationPersonnelApi.post(url, reservations);
  // },

  // Fonction pour obtenir les prévisualisations de réservation hebdomadaire
  previewReservationHebdomadaireP: async (personnelId, placeParkingId, reservationRequest) => {
    const url = `${BASE_URL}/reservation/ReservationHebdomadaireP/Previsualiser/${personnelId}/${placeParkingId}`;
    return await ReservationPersonnelApi.post(url, reservationRequest);
  },

  // // Fonction pour confirmer les réservations hebdomadaires
  // confirmReservationHebdomadaireP: async (reservations) => {
  //   const url = `${BASE_URL}/reservation/ReservationHebdomadaireP/Confirmer`;
  //   return await ReservationPersonnelApi.post(url, reservations);
  // },

  // Fonction pour obtenir les prévisualisations de réservation semestrielle
  previewReservationSemestrielleP: async (personnelId, placeParkingId, reservationRequest) => {
    const url = `${BASE_URL}/reservation/ReservationSemestrielleP/Previsualiser/${personnelId}/${placeParkingId}`;
    return await ReservationPersonnelApi.post(url, reservationRequest);
  },

  // // Fonction pour confirmer les réservations semestrielles
  // confirmReservationSemestrielleP: async (reservations) => {
  //   const url = `${BASE_URL}/reservation/ReservationSemestrielleP/Confirmer`;
  //   return await ReservationPersonnelApi.post(url, reservations);
  // },
  fetchReservations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Reservation`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      throw error.response?.data || "Erreur inconnue";
    }
  },

};

export default ReservationPersonnelApi;
