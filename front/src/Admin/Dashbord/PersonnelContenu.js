import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Snackbar,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const API_PERSONNEL = "https://localhost:7031/api/Personnel";

function Personnel() {
  const [personnel, setPersonnel] = useState([]);
  const [newPersonnel, setNewPersonnel] = useState({
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
    role: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Added success message state
  const [page, setPage] = useState(1); // Current page
  const [placesPerPage, setPlacesPerPage] = useState(5); // Number of items per page

  // Récupérer le personnel depuis l'API
  const fetchPersonnel = async () => {
    try {
      const response = await axios.get(API_PERSONNEL);
      setPersonnel(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du personnel:", error);
    }
  };

  // Ajouter un personnel via l'API
  const addPersonnel = async () => {
    setFormError(""); // Réinitialiser l'erreur de formulaire
    setEmailError(""); // Réinitialiser l'erreur email
    // Vérification des champs requis
    if (!newPersonnel.nom || !newPersonnel.prenom || !newPersonnel.email || !newPersonnel.motdepasse || !newPersonnel.role) {
      setFormError("Tous les champs sont obligatoires.");
      return;
    }
    // Vérifier si l'email est valide
    if (!newPersonnel.email.includes("@edu-emsi.ma")) {
      setEmailError("L'email doit contenir @edu-emsi.ma");
      return;
    }

    try {
      await axios.post(API_PERSONNEL, newPersonnel);
      setNewPersonnel({ nom: "", prenom: "", email: "", motdepasse: "", role: "" });
      setSuccessMessage("Personnel ajouté avec succès !");
      setOpenDialog(false); // Fermer la boîte de dialogue après ajout
      fetchPersonnel(); // Actualiser la liste du personnel
    } catch (error) {
      console.error("Erreur lors de l'ajout du personnel:", error);
    }
  };

  // Supprimer un personnel via l'API
  const deletePersonnel = async (id) => {
    try {
      await axios.delete(`${API_PERSONNEL}/${id}`);
      fetchPersonnel(); // Actualiser la liste du personnel
    } catch (error) {
      console.error("Erreur lors de la suppression du personnel:", error);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPersonnel({ ...newPersonnel, [name]: value });
  };

  // Pagination handler
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculer les personnels à afficher en fonction de la page actuelle
  const currentPersonnel = personnel.slice((page - 1) * placesPerPage, page * placesPerPage);

  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="contained" color="success" onClick={() => setOpenDialog(true)}>
        +Ajouter un personnel
      </Button>

      {/* Dialog pour le formulaire d'ajout */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle textAlign="center">Ajouter un personnel</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              label="Nom"
              name="nom"
              value={newPersonnel.nom}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
              error={!!formError}
              helperText={formError}
            />
            <TextField
              label="Prénom"
              name="prenom"
              value={newPersonnel.prenom}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
              error={!!formError}
              helperText={formError}
            />
            <TextField
              label="Email"
              name="email"
              value={newPersonnel.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!emailError}
              helperText={emailError}
              required
            />
            <TextField
              label="Mot de passe"
              name="motdepasse"
              value={newPersonnel.motdepasse}
              onChange={handleChange}
              type="password"
              variant="outlined"
              fullWidth
              required
            />
            <Select
              name="role"
              value={newPersonnel.role}
              onChange={handleChange}
              displayEmpty
              variant="outlined"
              fullWidth
              required
            >
              <MenuItem value="" disabled>Sélectionnez un rôle</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Teacher">Teacher</MenuItem>
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="black">
            Annuler
          </Button>
          <Button onClick={addPersonnel} color="primary" variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {successMessage && (
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
        />
      )}

      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Nom</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Prénom</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Rôle</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Supprimer</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPersonnel.map((personnelItem) => (
            <TableRow key={personnelItem.id}>
              <TableCell>{personnelItem.id}</TableCell>
              <TableCell>{personnelItem.nom}</TableCell>
              <TableCell>{personnelItem.prenom}</TableCell>
              <TableCell>{personnelItem.email}</TableCell>
              <TableCell>{personnelItem.role}</TableCell>
              <TableCell>
                <IconButton color="error" onClick={() => deletePersonnel(personnelItem.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(personnel.length / placesPerPage)}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 2, display: "flex", justifyContent: "center" 
        }}
        color="success"

      />
    </Box>
  );
}

export default Personnel;
