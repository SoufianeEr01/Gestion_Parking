import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Box,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const groupes = ["Groupe A", "Groupe B", "Groupe C"]; // Exemples de groupes

function EmploisContent() {
  const [emplois, setEmplois] = useState([]);
  const [filteredEmplois, setFilteredEmplois] = useState([]);
  const [selectedGroupe, setSelectedGroupe] = useState(""); // Groupe sélectionné
  const [open, setOpen] = useState(false);
  const [currentEmploi, setCurrentEmploi] = useState({
    jour: "",
    dateDebut: "",
    dateFin: "",
    groupeId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmplois = JSON.parse(sessionStorage.getItem("emplois")) || [];
    setEmplois(savedEmplois);
    setFilteredEmplois(savedEmplois); // Initialiser les emplois filtrés
  }, []);

  useEffect(() => {
    sessionStorage.setItem("emplois", JSON.stringify(emplois));
    if (selectedGroupe) {
      setFilteredEmplois(emplois.filter((emploi) => emploi.groupeId === selectedGroupe));
    } else {
      setFilteredEmplois(emplois);
    }
  }, [emplois, selectedGroupe]);

  const handleOpen = (emploi) => {
    setCurrentEmploi(emploi || { jour: "", dateDebut: "", dateFin: "", groupeId: "" });
    setOpen(true);
    setError("");
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmploi({ ...currentEmploi, [name]: value });
  };

  const validateForm = () => {
    if (!currentEmploi.jour || !currentEmploi.dateDebut || !currentEmploi.dateFin || !currentEmploi.groupeId) {
      setError("Tous les champs sont obligatoires.");
      return false;
    }
    if (currentEmploi.dateDebut >= currentEmploi.dateFin) {
      setError("L'heure de début doit être avant l'heure de fin.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (currentEmploi.id) {
      setEmplois(emplois.map((emp) => (emp.id === currentEmploi.id ? currentEmploi : emp)));
    } else {
      setEmplois([...emplois, { ...currentEmploi, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setEmplois(emplois.filter((emp) => emp.id !== id));
  };

  const handleGroupeChange = (event) => {
    setSelectedGroupe(event.target.value);
  };

  return (
    <Box
      sx={{
        py: 4,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Gestion des Emplois
      </Typography>
      <Divider sx={{ width: "100%", my: 2 }} />
      <FormControl sx={{ mb: 2, width: "50%" }}>
        <InputLabel id="select-groupe-label">Sélectionnez un Groupe</InputLabel>
        <Select
          labelId="select-groupe-label"
          value={selectedGroupe}
          onChange={handleGroupeChange}
          fullWidth
        >
          <MenuItem value="">Tous les Groupes</MenuItem>
          {groupes.map((groupe, index) => (
            <MenuItem key={index} value={groupe}>
              {groupe}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Ajouter un Emploi
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2, width: "90%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Jour</TableCell>
              <TableCell align="center">Heure de Début</TableCell>
              <TableCell align="center">Heure de Fin</TableCell>
              <TableCell align="center">Groupe</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmplois.map((emploi) => (
              <TableRow key={emploi.id}>
                <TableCell align="center">{emploi.jour}</TableCell>
                <TableCell align="center">{emploi.dateDebut}</TableCell>
                <TableCell align="center">{emploi.dateFin}</TableCell>
                <TableCell align="center">{emploi.groupeId}</TableCell>
                <TableCell align="center">
                  <Button color="primary" onClick={() => handleOpen(emploi)}>
                    Modifier
                  </Button>
                  <Button color="error" onClick={() => handleDelete(emploi.id)}>
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Ajouter/Modifier un Emploi</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Jour"
            name="jour"
            value={currentEmploi.jour}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            {jours.map((jour, index) => (
              <MenuItem key={index} value={jour}>
                {jour}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="time"
            label="Heure de Début"
            name="dateDebut"
            value={currentEmploi.dateDebut}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            type="time"
            label="Heure de Fin"
            name="dateFin"
            value={currentEmploi.dateFin}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Groupe"
            name="groupeId"
            value={currentEmploi.groupeId}
            onChange={handleChange}
            fullWidth
          >
            {groupes.map((groupe, index) => (
              <MenuItem key={index} value={groupe}>
                {groupe}
              </MenuItem>
            ))}
          </TextField>
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmploisContent;
