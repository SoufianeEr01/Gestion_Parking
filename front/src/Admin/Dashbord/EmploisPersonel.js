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

const EmploisPersonnel = () => {
  const [emplois, setEmplois] = useState([]);
  const [personnels, setPersonnels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState("");
  const [editingEmploi, setEditingEmploi] = useState(null);
  const [formData, setFormData] = useState({
    personnelId: "",
    heureDebut: "",
    heureFin: "",
    role: "",
    jour: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

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
        .filter((emploi) => emploi.jour >= 0 && emploi.jour <= 5) // Valider les jours
        .sort((a, b) => a.jour - b.jour); // Trier par ordre des jours
      setEmplois(sortedEmplois);
    } catch (error) {
      console.error("Acune emploi trouvé pour ce personnel.");
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
    setFormData({
      ...formData,
      personnelId,
    });
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatTime = (time) => {
    if (time.length === 5) {
      return `${time}:00`;
    }
    return time;
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEmploi(null);
  };

  const handleUpdateEmploi = async () => {
    try {
      const updatedEmploi = {
        personnelId: formData.personnelId,
        jour: parseInt(formData.jour, 10),
        heureDebut: formatTime(formData.heureDebut),
        heureFin: formatTime(formData.heureFin),
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
          color="success"
        >
          {personnels.map((personnel) => (
            <MenuItem key={personnel.id} value={personnel.id}>
              {personnel.nom}
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
                <TableCell><strong>Jour</strong></TableCell>
                <TableCell><strong>Heure de début</strong></TableCell>
                <TableCell><strong>Heure de fin</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 4, color: "gray", fontStyle: "italic" }}>
          Aucun emploi trouvé pour ce personnel.
        </Typography>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle textAlign="center">Modifier l'emploi Personnel</DialogTitle>
        <DialogContent>
          <TextField
            label="Jour"
            name="jour"
            value={joursParNum(formData.jour)}
            fullWidth
            margin="dense"
            disabled
          />
          <TextField
            label="Heure de début"
            name="heureDebut"
            value={formData.heureDebut}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            type="time"
          />
          <TextField
            label="Heure de fin"
            name="heureFin"
            value={formData.heureFin}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            type="time"
          />
          <TextField
            label="Role"
            name="role"
            value={formData.role}
            fullWidth
            margin="dense"
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Annuler</Button>
          <Button onClick={handleUpdateEmploi} color="success" variant="contained">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default EmploisPersonnel;
