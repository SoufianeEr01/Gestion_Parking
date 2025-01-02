import React, { useEffect, useState } from "react";
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Avatar, 
  Tabs, 
  Tab, 
  CircularProgress, 
  Alert 
} from "@mui/material";
import PersonnelApi from "../Api/PersonnelApi";
import EtudiantApi from "../Api/EtudiantApi";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailIcon from "@mui/icons-material/Email";
import ContactTab from "../Acceuil/ContactTab";

const ProfilePageUti = ({ onClose }) => {
  const [userData, setUserData] = useState({
    id: 0,
    nom: "",
    prenom: "",
    email: "",
    discriminator: "",
  });
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const validateEmail = (email) => email.endsWith("@emsi-edu.ma");

  const userSessionData = JSON.parse(sessionStorage.getItem("userData"));
  const userId = userSessionData?.id;
  const discriminator = userSessionData?.discriminator; // Récupère le rôle.

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !discriminator) {
        setError("Utilisateur non valide.");
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

        setUserData({ ...data, discriminator });
      } catch (error) {
        setError("Erreur lors de la récupération des données.");
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, discriminator]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSuccessMessage("");
  };

  const handleUpdate = async () => {
    if (!userData.nom || !userData.prenom || !userData.email) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
  
    if (!validateEmail(userData.email)) {
      setError("L'email doit contenir '@emsi-edu.ma'.");
      return;
    }
  
    try {
      if (discriminator === "Etudiant") {
        await EtudiantApi.updateEtudiant(userId, userData);
      } else if (discriminator === "Personnel") {
        await PersonnelApi.updatePersonnel(userId, userData);
      }
  
      setSuccessMessage("Mise à jour réussie !");
      setError(null);
  
      // Rafraîchissement de la page après 2 secondes
      setTimeout(() => {
        window.location.reload(); // Rechargement de la page
      }, 2000);
  
    } catch (error) {
      setError("Erreur lors de la mise à jour des données.");
      console.error("Erreur :", error);
    }
  };
  

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        backgroundColor: "#FFFFFF",
        p: 4,
        borderRadius: 4,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        width: "100%",
        height: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgb(0, 141, 54)",
          p: 2,
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: "#FFFFFF",
            color: "black",
            fontSize: 50,
            mr: 2,
          }}
        >
          {userData.nom[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ color: "#FFFFFF" }}>
            {userData.nom} {userData.prenom}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "black" }}>
            {discriminator}
          </Typography>
        </Box>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mt: 2,
          "& .MuiTabs-indicator": {
            backgroundColor: "rgb(0, 141, 54)",
          },
          "& .MuiTab-root": {
            color: "gray",
          },
          "& .MuiTab-root.Mui-selected": {
            color: "rgb(0, 141, 54)",
            fontWeight: "bold",
          },
        }}
        aria-label="Tabs profil"
      >
        <Tab label="Informations Personnelles" />
        <Tab label="Paramètres du compte" />
        <Tab label="Contacts" />
      </Tabs>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

      {activeTab === 1 && (
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            required
            fullWidth
            color="success"
            label="Nom"
            value={userData.nom}
            onChange={(e) => setUserData({ ...userData, nom: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            color="success"
            label="Prénom"
            value={userData.prenom}
            onChange={(e) => setUserData({ ...userData, prenom: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            color="success"
            label="Email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            sx={{ mb: 2 }}
            error={!validateEmail(userData.email)}
            helperText={!validateEmail(userData.email) ? "L'email doit contenir '@emsi-edu.ma'." : ""}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "rgb(0, 141, 54)", color: "#FFFFFF", mr: 2 }}
            onClick={handleUpdate}
          >
            Mettre à jour
          </Button>
          <Button color="black" onClick={() => onClose && onClose()}>
            Annuler
          </Button>
        </Box>
      )}

      {activeTab === 0 && (
        <Box
          sx={{
            mt: 2,
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
              color: "rgb(0, 141, 54)",
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            Votre Information
          </Typography> */}
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", p: 2, borderRadius: 3, backgroundColor: "rgb(245, 245, 245)" }}>
              <PersonOutlineIcon sx={{ color: "rgb(0, 141, 54)", mr: 2 }} />
              <Typography>
                <strong>Nom :</strong> {userData.nom}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", p: 2, borderRadius: 3, backgroundColor: "rgb(245, 245, 245)" }}>
              <PersonOutlineIcon sx={{ color: "rgb(0, 141, 54)", mr: 2 }} />
              <Typography>
                <strong>Prénom :</strong> {userData.prenom}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", p: 2, borderRadius: 3, backgroundColor: "rgb(245, 245, 245)" }}>
              <EmailIcon sx={{ color: "rgb(0, 141, 54)", mr: 2 }} />
              <Typography>
                <strong>Email :</strong> {userData.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      {activeTab === 2 && (
      <Box sx={{ mt: 3 }}>
      <ContactTab userEmail={userData.email} />
      </Box>
)}
    </Container>
  );
};

export default ProfilePageUti;
