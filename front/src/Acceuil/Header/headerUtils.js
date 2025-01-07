import EtudiantApi from '../../Api/EtudiantApi'
import PersonnelApi from '../../Api/PersonnelApi'
export const navigationLinks = [
  { name: "Accueil", id: "acceuil", path: "/" },
  { name: "À propos", id: "about", path: "/about" },
  { name: "Réservation", id: "reservation", path: "/parking" },
  { name: "Contact", id: "contact", path: "/contact" },
];

export const fetchUserData = async (setUser, setLoading) => {
  const userSessionData = JSON.parse(sessionStorage.getItem("userData"));
  const userId = userSessionData?.id;
  const discriminator = userSessionData?.discriminator;

  if (!userId || !discriminator) {
    setLoading(false);
    return;
  }

  try {
    let data;
    if (discriminator === "Etudiant") {
      data = await EtudiantApi.fetchEtudiantById(userId);
    } else if (discriminator === "Personnel") {
      data = await PersonnelApi.fetchPersonnelById(userId);
    } else {
      throw new Error("Rôle utilisateur inconnu.");
    }

    setUser({ ...data, discriminator });
  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    setLoading(false);
  }
};