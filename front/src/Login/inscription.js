import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Alert,
} from "@mui/material";
import SignApi from "./inscriptionApi";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("Etudiant");
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
    confirmMotdepasse: "",
    GroupeId: "",
    role: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [errorConfirmation, setErrorConfirmation] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await SignApi.fetchGroups();
        setGroups(groups);
      } catch (error) {
        setErrorMessage("Impossible de récupérer les groupes.");
      }
    };
    fetchGroups();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Réinitialiser les messages d'erreur spécifiques au champ modifié
    if (name === "email") setErrorMessageEmail("");
    if (name === "motdepasse") {
      setErrorMessagePassword("");
      setErrorConfirmation(""); // Réinitialiser la confirmation si le mot de passe change
    }
    if (name === "confirmMotdepasse") setErrorConfirmation("");
  };

  const handleEmailBlur = async () => {
    if (!validateEmail(formData.email)) {
      setErrorMessageEmail("L'email doit se terminer par @emsi-edu.ma");
      return;
    }
    try {
      const isEmailTaken = await SignApi.checkEmail(formData.email);
      if (isEmailTaken) {
        setErrorMessageEmail("Cet email est déjà utilisé.");
      } else {
        setErrorMessageEmail("");
      }
    } catch {
      setErrorMessageEmail("Erreur lors de la vérification de l'email.");
    }
  };

  const validatePassword = (password) => {
    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{10,}$/; // Au moins 10 caractères, lettres, chiffres et caractères spéciaux
    return regEx.test(password);
  };

  const handlePasswordBlur = () => {
    if (!validatePassword(formData.motdepasse)) {
      setErrorMessagePassword(
        <>
          Le mot de passe doit contenir :
          <ul>
            <li>Au moins 10 caractères</li>
            <li>Au moins une lettre minuscule</li>
            <li>Au moins une lettre majuscule</li>
            <li>Au moins un chiffre</li>
            <li>Au moins un caractère spécial (comme !, @, #, $, etc.)</li>
          </ul>
        </>
      );
    } else {
      setErrorMessagePassword("");
    }
  };

  const handleConfirmationMotDePasse = () => {
    if (formData.motdepasse !== formData.confirmMotdepasse) {
      setErrorConfirmation("Les mots de passe ne correspondent pas.");
    } else {
      setErrorConfirmation("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Réinitialiser tous les messages d'erreur
    setSuccessMessage("");
    setErrorMessage("");
    setErrorMessageEmail("");
    setErrorMessagePassword("");
    setErrorConfirmation("");

    // Validation des champs
    if (!validateEmail(formData.email)) {
      setErrorMessageEmail("L'email doit se terminer par @emsi-edu.ma");
      return;
    }

    if (formData.motdepasse !== formData.confirmMotdepasse) {
      setErrorConfirmation("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!validatePassword(formData.motdepasse)) {
      setErrorMessagePassword(
        <>
          Le mot de passe doit contenir :
          <ul>
            <li>Au moins 10 caractères</li>
            <li>Au moins une lettre minuscule</li>
            <li>Au moins une lettre majuscule</li>
            <li>Au moins un chiffre</li>
            <li>Au moins un caractère spécial (comme !, @, #, $, etc.)</li>
          </ul>
        </>      );
      return;
    }

    try {
      if (userType === "Etudiant") {
        await SignApi.createEtudiant({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          motdepasse: formData.motdepasse,
          GroupeId: formData.GroupeId,
        });
        setSuccessMessage("Étudiant inscrit avec succès !");
      } else {
        await SignApi.createPersonnel({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          motdepasse: formData.motdepasse,
          role: formData.role,
        });
        setSuccessMessage("Personnel inscrit avec succès !");
      }
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message || "Une erreur est survenue.");
    }
  };

  const validateEmail = (email) => email.endsWith("@emsi-edu.ma");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f9f4",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: 4,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ color: "rgb(29, 125, 61)", marginBottom: 3 }}
        >
          Inscription
        </Typography>

        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleEmailBlur}
            error={!!errorMessageEmail}
            helperText={errorMessageEmail}
            required
            style={{ marginTop: 15 }}
          />

          <TextField
            fullWidth
            label="Mot de passe"
            name="motdepasse"
            type="password"
            value={formData.motdepasse}
            onChange={handleInputChange}
            onBlur={handlePasswordBlur}
            error={!!errorMessagePassword}
            helperText={errorMessagePassword}
            required
            style={{ marginTop: 15 }}
          />

          <TextField
            fullWidth
            label="Confirmer mot de passe"
            name="confirmMotdepasse"
            type="password"
            value={formData.confirmMotdepasse}
            onChange={handleInputChange}
            onBlur={handleConfirmationMotDePasse}
            error={!!errorConfirmation}
            helperText={errorConfirmation}
            required
            style={{ marginTop: 15 }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Type d'utilisateur</InputLabel>
            <Select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <MenuItem value="Etudiant">Étudiant</MenuItem>
              <MenuItem value="Personnel">Personnel</MenuItem>
            </Select>
          </FormControl>

          {userType === "Etudiant" && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Groupe</InputLabel>
              <Select
                name="GroupeId"
                value={formData.GroupeId}
                onChange={handleInputChange}
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {userType === "Personnel" && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Rôle</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <MenuItem value="Administrateur">Administrateur</MenuItem>
                <MenuItem value="Enseignant">Enseignant</MenuItem>
              </Select>
            </FormControl>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ marginTop: 3, backgroundColor: "rgb(29, 125, 61)" }}
          >
            S'inscrire
          </Button>

          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
          </Typography>
        </form>
      </Box>
    </Box>
  );
};

export default SignUpPage;
