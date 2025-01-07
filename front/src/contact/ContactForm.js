import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Paper, Typography, Box, Snackbar, Alert } from "@mui/material";
import { Send } from "lucide-react";
import PersonIcon from '@mui/icons-material/Person';
import EtudiantApi from "../Api/EtudiantApi";
import PersonnelApi from "../Api/PersonnelApi";
import ContactApi from "../Api/ContactApi";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2e7d32",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2e7d32",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#2e7d32",
  },
};

function ContactForm() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
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
      setForm({ nom: form.nom, email: form.email, id: form.id, message: "" });

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
    <Box>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          border: "1px solid #e0e0e0",
          marginTop: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            color: "#1b5e20",
            fontWeight: 600,
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: 60,
              height: 3,
              backgroundColor: "#2e7d32",
              borderRadius: 2,
            },
          }}
        >
          Envoyez-nous un message
        </Typography>

        <Box sx={{ padding: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  color="success"
                  fullWidth
                  label="Nom"
                  name="nom"
                  value= {form.nom}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  disabled
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  color="success"
                  fullWidth
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  disabled
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  color="success"
                  fullWidth
                  label="Message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 4,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={<Send />}
                disabled={sending || !form.message}
                sx={{
                  py: 1.5,
                  px: 4,
                  backgroundColor: "#008D36",
                  "&:hover": {
                    backgroundColor: "#005d24",
                  },
                  borderRadius: 20,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  boxShadow: "0 4px 6px rgba(46, 125, 50, 0.2)",
                }}
              >
                {sending ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>

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
    </Box>
  );
}

export default ContactForm;
