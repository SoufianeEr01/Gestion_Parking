import React, { useState, useEffect } from "react";
import {
  Box,
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
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GroupApi from "../../Api/GroupApi";
import EtudiantApi from "../../Api/EtudiantApi";

function Etudiant() {
  const [etudiants, setEtudiants] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [newEtudiant, setNewEtudiant] = useState({
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
    groupeId: "",
  });
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const placesPerPage = 5;

  // Fetch students
  const fetchEtudiants = async () => {
    try {
      const data = await EtudiantApi.fetchEtudiants();
      setEtudiants(data);
    } catch (error) {
      setErrorMessage("Erreur lors de la récupération des étudiants.");
    }
  };

  // Fetch groups
  const fetchGroupes = async () => {
    try {
      const data = await GroupApi.fetchGroups();
      setGroupes(data);
    } catch (error) {
      setErrorMessage("Erreur lors de la récupération des groupes.");
    }
  };

  // Add a student
  const addEtudiant = async () => {
    try {
      await EtudiantApi.createEtudiant(newEtudiant);
      setSuccessMessage("Étudiant ajouté avec succès !");
      setOpenDialog(false);
      setNewEtudiant({ nom: "", prenom: "", email: "", motdepasse: "", groupeId: "" });
      fetchEtudiants();
    } catch (error) {
      setErrorMessage("Erreur lors de l'ajout de l'étudiant.");
    }
  };

  // Update a student
  const updateEtudiant = async () => {
    try {
      await EtudiantApi.updateEtudiant(selectedEtudiant.id, newEtudiant);
      setSuccessMessage("Étudiant mis à jour avec succès !");
      setOpenEditDialog(false);
      fetchEtudiants();
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour de l'étudiant.");
    }
  };

  // Delete a student
  const deleteEtudiant = async (id) => {
    try {
      await EtudiantApi.deleteEtudiant(id);
      fetchEtudiants();
    } catch (error) {
      setErrorMessage("Erreur lors de la suppression de l'étudiant.");
    }
  };

  // Handle page change
  const handlePageChange = (event, value) => setPage(value);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEtudiant((prev) => ({ ...prev, [name]: value }));
  };

  const openEditForm = (etudiant) => {
    setSelectedEtudiant(etudiant);
    setNewEtudiant(etudiant);
    setOpenEditDialog(true);
  };

  useEffect(() => {
    fetchEtudiants();
    fetchGroupes();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="contained" color="success" onClick={() => setOpenDialog(true)}>
        + Ajouter un étudiant
      </Button>

      {/* Add Student Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle textAlign="center">Ajouter un étudiant</DialogTitle>
        <DialogContent>
          <TextField name="nom" label="Nom" value={newEtudiant.nom} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="prenom" label="Prénom" value={newEtudiant.prenom} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="email" label="Email" value={newEtudiant.email} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="motdepasse" label="Mot de passe" value={newEtudiant.motdepasse} onChange={handleChange} fullWidth margin="dense" />
          <Select name="groupeId" value={newEtudiant.groupeId} onChange={handleChange} fullWidth>
            <MenuItem value="" disabled>
              Choisissez un groupe
            </MenuItem>
            {groupes.map((groupe) => (
              <MenuItem key={groupe.id} value={groupe.id}>
                {groupe.nom}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button color="success" onClick={addEtudiant} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth>
        <DialogTitle textAlign="center">Modifier un étudiant</DialogTitle>
        <DialogContent>
          <TextField name="nom" label="Nom" value={newEtudiant.nom} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="prenom" label="Prénom" value={newEtudiant.prenom} onChange={handleChange} fullWidth margin="dense" />
          <TextField name="email" label="Email" value={newEtudiant.email} onChange={handleChange} fullWidth margin="dense" />
          <Select name="groupeId" value={newEtudiant.groupeId} onChange={handleChange} fullWidth>
            <MenuItem value="" disabled>
              Choisissez un groupe
            </MenuItem>
            {groupes.map((groupe) => (
              <MenuItem key={groupe.id} value={groupe.id}>
                {groupe.nom}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Annuler</Button>
          <Button color="success" onClick={updateEtudiant} variant="contained">
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Prénom</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Groupe</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {etudiants.slice((page - 1) * placesPerPage, page * placesPerPage).map((etudiant) => (
            <TableRow key={etudiant.id}>
              <TableCell>{etudiant.nom}</TableCell>
              <TableCell>{etudiant.prenom}</TableCell>
              <TableCell>{etudiant.email}</TableCell>
              <TableCell>{etudiant.groupeId}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => openEditForm(etudiant)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => deleteEtudiant(etudiant.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        count={Math.ceil(etudiants.length / placesPerPage)}
        page={page}
        onChange={handlePageChange}
        color="success"
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />

      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage("")} message={successMessage} />
      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage("")} message={errorMessage} />
    </Box>
  );
}

export default Etudiant;
