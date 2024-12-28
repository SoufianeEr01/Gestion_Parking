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
import AdminApi from "../../Api/AdminApi";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailIcon from "@mui/icons-material/Email";

const ProfilePage = ({ onClose }) => {
  const [adminData, setAdminData] = useState({ id: 0, nom: "", prenom: "", email: "" });
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const validateEmail = (email) => email.endsWith("@emsi-edu.ma");

  const adminId = JSON.parse(sessionStorage.getItem("userData"))?.id;

  useEffect(() => {
    const fetchAdmin = async () => {
      if (!adminId) return;

      try {
        const data = await AdminApi.fetchAdminById(adminId);
        setAdminData(data);
      } catch (error) {
        setError("Erreur lors de la récupération des données.");
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSuccessMessage("");
  };

  const handleUpdate = async () => {
    if (!adminData.nom || !adminData.prenom || !adminData.email) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (!validateEmail(adminData.email)) {
      setError("L'email doit contenir '@emsi-edu.ma'.");
      return;
    }

    try {
      await AdminApi.updateAdmin(adminId, adminData);
      setSuccessMessage("Mise à jour réussie !");
      setError(null);

      // Fermer le profil après la mise à jour réussie
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 2000); // Attend 2 secondes avant de fermer
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
        borderRadius: 2, 
        boxShadow: 3, 
        width: "100%", 
        height: "auto" ,
        borderRadius: 4,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header Section */}
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
            mr: 2 
          }}
        >
          {adminData.nom[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ color: "#FFFFFF" }}>
            {adminData.nom} {adminData.prenom}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "black" }}>
            Administrateur
          </Typography>
        </Box>
      </Box>

      {/* Tabs Section */}
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
        aria-label="success tabs example"
      >
        <Tab label="Informations Personnelles" />
        <Tab label="Paramètres du compte" />
      </Tabs>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

      {/* Account Settings Tab */}
      {activeTab === 1 && (
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            required
            fullWidth
            color="success"
            label="Nom"
            value={adminData.nom}
            onChange={(e) => setAdminData({ ...adminData, nom: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            color="success"
            label="Prénom"
            value={adminData.prenom}
            onChange={(e) => setAdminData({ ...adminData, prenom: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            color="success"
            label="Email"
            value={adminData.email}
            onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
            sx={{ mb: 2 }}
            error={!validateEmail(adminData.email)}
            helperText={!validateEmail(adminData.email) ? "L'email doit contenir '@emsi-edu.ma'." : ""}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "rgb(0, 141, 54)", color: "#FFFFFF", mr: 2 }}
            onClick={handleUpdate}
          >
            Mettre à jour
          </Button>
          <Button
            color="black"
            onClick={() => onClose && onClose()}
          >
            Annuler
          </Button>
        </Box>
      )}

      {/* Account Information Tab */}
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
          <Typography
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
          </Typography>
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", p: 2, borderRadius: 3, backgroundColor: "rgb(245, 245, 245)" }}>
              <PersonOutlineIcon sx={{ color: "rgb(0, 141, 54)", mr: 2 }} />
              <Typography>
                <strong>Nom :</strong> {adminData.nom}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", p: 2, borderRadius: 3, backgroundColor: "rgb(245, 245, 245)" }}>
              <PersonOutlineIcon sx={{ color: "rgb(0, 141, 54)", mr: 2 }} />
              <Typography>
                <strong>Prénom :</strong> {adminData.prenom}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", p: 2, borderRadius: 3, backgroundColor: "rgb(245, 245, 245)" }}>
              <EmailIcon sx={{ color: "rgb(0, 141, 54)", mr: 2 }} />
              <Typography>
                <strong>Email :</strong> {adminData.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ProfilePage;
