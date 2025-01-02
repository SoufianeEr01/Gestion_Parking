import axios from "axios";

const BASE_URL = "https://localhost:7031/api";

const ReponseApi = {
  fetchReponsesByContactId: async (contactId) => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) throw new Error("Token d'authentification manquant");

    try {
      const response = await axios.get(`${BASE_URL}/Reponse/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.messageReponse || null;
    } catch (error) {
      return null;
    }
  },

  createReponse: async (contactId, reponseData) => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) throw new Error("Token manquant");

    try {
      const response = await axios.post(
        `${BASE_URL}/Reponse/add`,
        {
          contactId,
          messageReponse: reponseData.text,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteReponse: async (id) => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) throw new Error("Token d'authentification manquant");

    try {
      await axios.delete(`${BASE_URL}/Reponse/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error(`Erreur lors de la suppression de la réponse ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

export default ReponseApi;
