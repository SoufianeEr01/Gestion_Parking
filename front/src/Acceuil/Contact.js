import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Box,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EtudiantApi from "../Api/EtudiantApi";
import PersonnelApi from "../Api/PersonnelApi";
import ContactApi from "../Api/ContactApi";

function ContactPage() {
  const [form, setForm] = useState({ nom: "", email: "", id: "", message: "" });
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userDataJSON = sessionStorage.getItem("userData");
    if (userDataJSON) {
      const userData = JSON.parse(userDataJSON);
      const fetchData = async () => {
        try {
          let data;
          if (userData.discriminator === "Etudiant") {
            data = await EtudiantApi.fetchEtudiantById(userData.id);
          } else if (userData.discriminator === "Personnel") {
            data = await PersonnelApi.fetchPersonnelById(userData.id);
          } else {
            throw new Error("Type d'utilisateur inconnu.");
          }

          setForm((prevForm) => ({
            ...prevForm,
            email: userData.email || "",
            id: userData.id || "",
            nom: data?.nom || "Nom inconnu",
          }));
        } catch (error) {
          setErrorMessage("Erreur lors du chargement des données utilisateur.");
        }
      };
      fetchData();
    }
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setSending(true);
    try {
      const userDataJSON = sessionStorage.getItem("userData");
      const userData = userDataJSON ? JSON.parse(userDataJSON) : {};
      const userId = userData?.id || null;

      const contactData = {
        ...form,
        userId,
        dateEnvoi: new Date().toISOString(),
      };

      await ContactApi.createContact(contactData);

      setSuccessMessage("Message envoyé avec succès !");
      setForm({ nom: "", email: "", message: "" });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || "Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          boxShadow: 10,
          borderRadius: 3,
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#008D36",
            padding: 2,
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Nous Contacter
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Nous sommes ici pour vous aider
          </Typography>
        </Box>

        <CardContent sx={{ padding: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                color="success"
                fullWidth
                label="Nom"
                name="nom"
                value={form.nom}
                onChange={handleFormChange}
                variant="outlined"
                required
                disabled
                InputProps={{
                  startAdornment: (
                    <AccountCircleIcon sx={{ marginRight: 1, color: "#008D36" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="success"
                fullWidth
                label="Email"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                variant="outlined"
                required
                disabled
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ marginRight: 1, color: "#008D36" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="success"
                fullWidth
                label="Message"
                name="message"
                value={form.message}
                onChange={handleFormChange}
                variant="outlined"
                multiline
                rows={4}
                required
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: "center", padding: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={sending || !form.nom || !form.email || !form.message}
            sx={{
              backgroundColor: "#008D36",
              color: "white",
              padding: "10px 20px",
              borderRadius: 20,
              fontWeight: "bold",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "#008D36",
              },
            }}
          >
            {sending ? "Envoi en cours..." : "Envoyer le message"}
          </Button>
        </CardActions>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage("")}
        >
          <Alert severity="success" variant="filled">
            {successMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage("")}
        >
          <Alert severity="error" variant="filled">
            {errorMessage}
          </Alert>
        </Snackbar>
      </Card>
    </Box>
  );
}

export default ContactPage;
