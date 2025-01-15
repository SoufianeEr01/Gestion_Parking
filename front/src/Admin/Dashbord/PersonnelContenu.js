import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonnelApi from "../../Api/PersonnelApi";

const Personnele = () => {
  const [personnels, setPersonnels] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState(null);
  const [personnelData, setPersonnelData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
    role: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const personnelsPerPage = 5;

  // État pour la confirmation de suppression
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [personnelToDelete, setPersonnelToDelete] = useState(null);

  const fetchPersonnels = async () => {
    try {
      const data = await PersonnelApi.fetchPersonnels();
      setPersonnels(data);
    } catch (error) {
      setErrorMessage("Erreur lors de la récupération des personnels.");
    }
  };

  useEffect(() => {
    fetchPersonnels();
  }, []);

  const validateEmail = (email) => email.endsWith("@emsi-edu.ma");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonnelData({ ...personnelData, [name]: value });
  };

  const handleSubmit = async () => {
    const { nom, prenom, email, motdepasse, role } = personnelData;

    if (!nom.trim() || !prenom.trim() || !email.trim() || (!editingPersonnel && !motdepasse.trim()) || !role.trim()) {
      setErrorMessage("Tous les champs sont obligatoires !");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("L'email doit contenir '@emsi-edu.ma'.");
      return;
    }

    try {
      if (editingPersonnel) {
        await PersonnelApi.updatePersonnel(editingPersonnel.id, personnelData);
        setSuccessMessage("Personnel modifié avec succès !");
      } else {
        await PersonnelApi.createPersonnel(personnelData);
        setSuccessMessage("Personnel ajouté avec succès !");
      }

      setOpenDialog(false);
      setPersonnelData({ nom: "", prenom: "", email: "", motdepasse: "", role: "" });
      fetchPersonnels();
    } catch (error) {
      setErrorMessage("Erreur lors de l'opération.");
    }
  };

  const confirmDelete = (personnel) => {
    setPersonnelToDelete(personnel);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      await PersonnelApi.deletePersonnel(personnelToDelete.id);
      setSuccessMessage("Personnel supprimé avec succès !");
      fetchPersonnels();
    } catch (error) {
      setErrorMessage("Erreur lors de la suppression du personnel.");
    } finally {
      setOpenDeleteDialog(false);
      setPersonnelToDelete(null);
    }
  };

  const openEditDialog = (personnel) => {
    setEditingPersonnel(personnel);
    setPersonnelData({ ...personnel, motdepasse: "" });
    setOpenDialog(true);
  };

  const indexOfLastPersonnel = page * personnelsPerPage;
  const indexOfFirstPersonnel = indexOfLastPersonnel - personnelsPerPage;
  const currentPersonnels = personnels.slice(indexOfFirstPersonnel, indexOfLastPersonnel);

  return (
    <Box sx={{ padding: 3 }}>
      <Button
        variant="contained"
        color="success"
        onClick={() => {
          setEditingPersonnel(null);
          setPersonnelData({ nom: "", prenom: "", email: "", motdepasse: "", role: "" });
          setOpenDialog(true);
        }}
      >
        + Ajouter un Personnel
      </Button>

      {/* Dialog pour Ajouter/Modifier */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle textAlign="center">
          {editingPersonnel ? "Modifier un Personnel" : "Ajouter un Personnel"}
        </DialogTitle>
        <DialogContent>
          {/* Champs */}
          <TextField
          color="success"
            label="Nom"
            name="nom"
            value={personnelData.nom}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            sx={{ mt: 2 }}
          />
          <TextField
          color="success"
            label="Prénom"
            name="prenom"
            value={personnelData.prenom}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            sx={{ mt: 2 }}
          />
          <TextField
          color="success"
            label="Email"
            name="email"
            value={personnelData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            sx={{ mt: 2 }}
            error={!validateEmail(personnelData.email)}
            helperText={!validateEmail(personnelData.email) ? "L'email doit contenir '@emsi-edu.ma'." : ""}
          />
          {!editingPersonnel && (
            <TextField
            color="success"
              label="Mot de Passe"
              name="motdepasse"
              type="password"
              value={personnelData.motdepasse}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
              sx={{ mt: 2 }}
            />
          )}
          <Select
          color="success"
            name="role"
            value={personnelData.role}
            onChange={handleChange}
            fullWidth
            required
            displayEmpty
            sx={{ mt: 2 }}
            disabled={editingPersonnel}
          >
            
            <MenuItem value="" disabled>
              Sélectionnez un rôle
            </MenuItem>
            <MenuItem value="administrateur">ADMINISTRATEUR</MenuItem>
            <MenuItem value="Enseignant">ENSEIGNANT</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="black">
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="success" variant="contained" >
            {editingPersonnel ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer ce personnel ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les messages */}
      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={() => {
          setSuccessMessage("");
          setErrorMessage("");
        }}
        message={successMessage || errorMessage}
      />

      {/* Tableau des personnels */}
      <Table sx={{ mt: 3.5 }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Nom</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Prénom</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Rôle</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPersonnels.map((personnel) => (
            <TableRow key={personnel.id}>
              <TableCell>{personnel.nom}</TableCell>
              <TableCell>{personnel.prenom}</TableCell>
              <TableCell>{personnel.email}</TableCell>
              <TableCell>{personnel.role.toUpperCase()}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => openEditDialog(personnel)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => confirmDelete(personnel)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        count={Math.ceil(personnels.length / personnelsPerPage)}
        page={page}
        onChange={(event, value) => setPage(value)}
        color="success"
        sx={{ mt: 3, justifyContent: "center", display: "flex" }}
      />
    </Box>
  );
};

export default Personnele;
