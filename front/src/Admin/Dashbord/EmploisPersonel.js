import React, { useState, useEffect } from "react";
import {
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import EmploiPersonnelApi from "../../Api/EmploisPersonnelApi";
import PersonnelApi from "../../Api/PersonnelApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const EmploisPersonnel = () => {
  const [emplois, setEmplois] = useState([]);
  const [personnels, setPersonnels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState("");
  const [editingEmploi, setEditingEmploi] = useState(null);
  const [emploiToDelete, setEmploiToDelete] = useState(null);
  const [formData, setFormData] = useState({
    personnelId: "",
    heureDebut: "",
    heureFin: "",
    role: "",
    jour: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Récupération des personnels
  const fetchPersonnels = async () => {
    try {
      setLoading(true);
      const data = await PersonnelApi.fetchPersonnels();
      setPersonnels(data);
    } catch (error) {
      setError("Erreur lors de la récupération des personnels.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const joursParNum = (jourNum) => {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return jours[jourNum] || "Inconnu";
  };

  // Récupération des emplois
  const fetchEmplois = async (personnelId) => {
    try {
      setLoading(true);
      const data = await EmploiPersonnelApi.getEmploiByPersonnel(personnelId);
      const sortedEmplois = data
        .filter((emploi) => emploi.jour >= 0 && emploi.jour <= 5)
        .sort((a, b) => a.jour - b.jour);
      setEmplois(sortedEmplois);
    } catch (error) {
      setError("Erreur lors de la récupération des emplois.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnels();
  }, []);

  const handlePersonnelChange = (event) => {
    const personnelId = event.target.value;
    setSelectedPersonnel(personnelId);
    setEmplois([]);
    setError(null);
    setFormData({ ...formData, personnelId });
    if (personnelId) fetchEmplois(personnelId);
  };

  const handleEditClick = (emploi) => {
    setEditingEmploi(emploi);
    setFormData({
      personnelId: emploi.personnelId,
      heureDebut: emploi.heureDebut,
      heureFin: emploi.heureFin,
      role: emploi.role,
      jour: emploi.jour,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (emploi) => {
    setEmploiToDelete(emploi);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await EmploiPersonnelApi.deleteEmploiPersonnel(emploiToDelete.id);
      setDeleteDialogOpen(false);
      setEmploiToDelete(null);
      fetchEmplois(selectedPersonnel);
    } catch (error) {
      setError("Erreur lors de la suppression de l'emploi.");
      console.error(error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEmploi(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEmploiToDelete(null);
  };

  const handleUpdateEmploi = async () => {
    try {
      const updatedEmploi = {
        personnelId: formData.personnelId,
        jour: parseInt(formData.jour, 10),
        heureDebut: formData.heureDebut,
        heureFin: formData.heureFin,
        role: formData.role,
      };
      await EmploiPersonnelApi.updateEmploiPersonnel(editingEmploi.id, updatedEmploi);
      setDialogOpen(false);
      setEditingEmploi(null);
      fetchEmplois(selectedPersonnel);
    } catch (error) {
      setError("Erreur lors de la mise à jour de l'emploi.");
      console.error(error);
    }
  };

  return (
    <Box padding={3} sx={{ flexDirection: "column", display: "flex", alignItems: "center" }}>
      <FormControl margin="normal" sx={{ mb: 2, width: "50%" }}>
        <InputLabel id="select-personnel-label">Sélectionnez un personnel</InputLabel>
        <Select
          labelId="select-personnel-label"
          value={selectedPersonnel}
          onChange={handlePersonnelChange}
          fullWidth
        >
          {personnels.map((personnel) => (
            <MenuItem key={personnel.id} value={personnel.id}>
              {personnel.nom} {personnel.prenom} - {personnel.role}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" marginTop={3}>
          <CircularProgress />
          <Typography variant="h6" color="textSecondary" style={{ marginLeft: "15px" }}>
            Chargement des données...
          </Typography>
        </Box>
      ) : emplois.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2, width: "80%" }}>
        <Table aria-label="table des emplois" size="small">
        <TableHead>
              <TableRow>
                <TableCell>Jour</TableCell>
                <TableCell>Heure de début</TableCell>
                <TableCell>Heure de fin</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emplois.map((emploi) => (
                <TableRow key={emploi.id}>
                  <TableCell>{joursParNum(emploi.jour)}</TableCell>
                  <TableCell>{emploi.heureDebut}</TableCell>
                  <TableCell>{emploi.heureFin}</TableCell>
                  <TableCell>{emploi.role}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditClick(emploi)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(emploi)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 4, color: "gray" }}>
          Aucun emploi trouvé pour ce personnel.
        </Typography>
      )}

      {/* Dialog pour l'édition */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Modifier l'emploi</DialogTitle>
        <DialogContent>
          <TextField
            label="Jour"
            name="jour"
            value={joursParNum(formData.jour)}
            fullWidth
            disabled
          />
          <TextField
            label="Heure de début"
            name="heureDebut"
            value={formData.heureDebut}
            onChange={handleFormChange}
            fullWidth
            type="time"
          />
          <TextField
            label="Heure de fin"
            name="heureFin"
            value={formData.heureFin}
            onChange={handleFormChange}
            fullWidth
            type="time"
          />
          <TextField label="Role" name="role" value={formData.role} fullWidth disabled />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleUpdateEmploi} color="success" variant="contained">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour la suppression */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer cet emploi ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="Black">Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmploisPersonnel;