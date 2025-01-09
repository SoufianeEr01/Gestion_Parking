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
  Box,
  Snackbar,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Typography
  
} from "@mui/material";
import GroupApi from "../../Api/GroupApi";
import EmploiApi from "../../Api/EmploiApi";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmploisPersonnel from "../../Api/EmploisPersonnelApi";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function EmploisContent() {
  const [successMessage, setSuccessMessage] = useState("");
  const [emplois, setEmplois] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [selectedGroupe, setSelectedGroupe] = useState("");
  const [viewEmplois, setViewEmplois] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentEmploi, setCurrentEmploi] = useState({
    jour: "",
    dateDebut: "",
    dateFin: "",
    groupeId: "",
  });
  const [error, setError] = useState("");
  const [editEmploi, setEditEmploi] = useState(null); // Pour stocker l'emploi à modifier

  // Charger les groupes depuis l'API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await GroupApi.fetchGroups();
        setGroupes(data);
      } catch (error) {
        console.error("Erreur lors du chargement des groupes:", error);
        setError("Erreur lors du chargement des groupes.");
      }
    };
    fetchGroups();
  }, []);

  const fetchgroupId = (id) => {
    const groupe = groupes.find((groupe) => groupe.id === id);
    return groupe ? groupe.nom : "";
  };

  const fetchEmploisForGroup = async (groupeId) => {
    try {
      const data = await EmploiApi.fetchEmploisByGroupe(groupeId);
      setEmplois(data);
    } catch (error) {
      console.error("Erreur lors du chargement des emplois:", error);
      setError("Les emplois ne sont pas disponibles pour ce groupe.");
    }
  };

  const handleShowEmplois = () => {
    if (selectedGroupe) {
      fetchEmploisForGroup(selectedGroupe);
      setViewEmplois(true);
    } else {
      setError("Veuillez sélectionner un groupe.");
    }
  };

  const handleGroupeChange = (event) => {
    setSelectedGroupe(event.target.value);
    setError("");
  };

  const jourparnum = (jourNum) => {
    return jours[jourNum] || "Inconnu";
  };

  const handleSubmit = async () => {
    if (!currentEmploi.jour || !currentEmploi.dateDebut || !currentEmploi.dateFin || !currentEmploi.groupeId) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    const jourNum = jours.indexOf(currentEmploi.jour);
    if (jourNum === 6) {
      setError("Jour invalide.");
      return;
    }

    const emploiData = {
      jour: jourNum,
      dateDebut: currentEmploi.dateDebut + ":00",
      dateFin: currentEmploi.dateFin + ":00",
      groupe_Id: currentEmploi.groupeId,
    };

    try {
      const newEmploi = await EmploiApi.createEmploi(emploiData);
      setSuccessMessage("Emploi ajouté avec succès !");
      handleClose();
    } catch (error) {
      setError("Erreur lors de l'ajout de l'emploi.");
    }
  };

  const handleClose = () => setOpen(false);

  // Fonction pour supprimer un emploi
  const handleDelete = async (id) => {
    const confirmDeletion = window.confirm("Êtes-vous sûr de vouloir supprimer cet emploi ?");
    if (!confirmDeletion) return;
  
    try {
      await EmploiApi.deleteEmploi(id, confirmDeletion);
      setEmplois(emplois.filter((emploi) => emploi.id !== id)); // Mettre à jour la liste des emplois
      setSuccessMessage("Emploi supprimé avec succès.");
    } catch (error) {
      setError("Erreur lors de la suppression de l'emploi.");
    }
  };

  // Fonction pour éditer un emploi
  const handleEdit = (emploi) => {
    setEditEmploi(emploi);
    setCurrentEmploi({
      jour: jours[emploi.jour],
      dateDebut: emploi.dateDebut.split(":")[0] + ":" + emploi.dateDebut.split(":")[1], 
      dateFin: emploi.dateFin.split(":")[0] + ":" + emploi.dateFin.split(":")[1], 
      groupeId: emploi.groupe_Id,
    });
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (!currentEmploi.jour || !currentEmploi.dateDebut || !currentEmploi.dateFin || !currentEmploi.groupeId) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    const jourNum = jours.indexOf(currentEmploi.jour);
    if (jourNum === 6) {
      setError("Jour invalide.");
      return;
    }

    const emploiData = {
      jour: jourNum,
      dateDebut: currentEmploi.dateDebut + ":00",
      dateFin: currentEmploi.dateFin + ":00",
      groupe_Id: currentEmploi.groupeId,
    };

    try {
      console.log("Edit emploi:", editEmploi);
      await EmploiApi.updateEmploi(editEmploi.id, emploiData);
      setSuccessMessage("Emploi mis à jour avec succès.");
      handleClose();
      fetchEmploisForGroup(selectedGroupe); // Recharger la liste après mise à jour
    } catch (error) {
      setError("Erreur lors de la mise à jour de l'emploi.");
    }
  };

  return (
    <Box sx={{ px: 3, display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#ffffff" }}>
      {!viewEmplois && (
        <div>
          <Button variant="contained" color="success"  fullWidth onClick={() => setOpen(true)} sx={{ mb: 4,mt:8 }} >
          <AddIcon/> Ajouter Emploi
          </Button>
          <Button variant="contained" color="success" fullWidth onClick={() => setViewEmplois(true)} sx={{ mb: 4,mt:2}}>
            Afficher Emplois
          </Button>
          <Button variant="contained" color="success" fullWidth   sx={{ mb: 4,mt:2}}>
            <AddIcon/> Ajouter Emplois Personel
          </Button>
          <Button variant="contained" color="success" fullWidth  sx={{ mb: 4,mt:2 }}>
            Afficher Emplois Personel
          </Button>
        </div>
      )}

      {viewEmplois && (
        <>
          <FormControl sx={{ mb: 2, width: "50%" ,mt:3}}>
            <InputLabel id="select-groupe-label">Sélectionnez un Groupe</InputLabel>
            <Select labelId="select-groupe-label" value={selectedGroupe} onChange={handleGroupeChange} fullWidth color="success">
              {groupes.map((groupe) => (
                <MenuItem key={groupe.id} value={groupe.id}>
                  {groupe.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="success" onClick={handleShowEmplois} sx={{ mb: 2 }}>
            Afficher les Emplois
          </Button>
        </>
      )}

      {emplois.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2, width: "90%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ fontWeight: "bold" }}>Jour</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>Heure de Début</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>Heure de Fin</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>Groupe</TableCell>
                <TableCell  align="center" style={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emplois.map((emploi) => (
                <TableRow key={emploi.id}>
                  <TableCell align="center">{jourparnum(emploi.jour)}</TableCell>
                  <TableCell align="center">{emploi.dateDebut}</TableCell>
                  <TableCell align="center">{emploi.dateFin}</TableCell>
                  <TableCell align="center">{fetchgroupId(emploi.groupe_Id)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(emploi)} color="primary"><EditIcon/> </IconButton>
                    <IconButton onClick={() => handleDelete(emploi.id)} color="error"><DeleteIcon/></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog pour ajouter ou éditer un emploi */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle style={{textAlign:'center'}}>{editEmploi ? "Modifier l'Emploi" : "Ajouter un Emploi"}</DialogTitle>
        <DialogContent>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <TextField
            label="Jour"
            value={currentEmploi.jour}
            onChange={(e) => setCurrentEmploi({ ...currentEmploi, jour: e.target.value })}
            select
            fullWidth
            sx={{ mb: 2 , mt:2}}
          
            disabled={editEmploi}
            color="success"
          >
            {jours.map((jour) => (
              <MenuItem key={jour} value={jour}>
                {jour}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Heure de début"
            value={currentEmploi.dateDebut}
            onChange={(e) => setCurrentEmploi({ ...currentEmploi, dateDebut: e.target.value })}
            type="time"
            fullWidth
            sx={{ mb: 2 }}
            color="success"
          />
          <TextField
            label="Heure de fin"
            value={currentEmploi.dateFin}
            onChange={(e) => setCurrentEmploi({ ...currentEmploi, dateFin: e.target.value })}
            type="time"
            fullWidth
            sx={{ mb: 2 }}
            color="success"
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Groupe</InputLabel>
            <Select
              value={currentEmploi.groupeId}
              onChange={(e) => setCurrentEmploi({ ...currentEmploi, groupeId: e.target.value })}
              label="Groupe"
              disabled={editEmploi}
              color="success"
            >
              {groupes.map((groupe) => (
                <MenuItem key={groupe.id} value={groupe.id}>
                  {groupe.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="Black">Annuler</Button>
          <Button onClick={editEmploi ? handleUpdate : handleSubmit} variant="contained" color="success">
            {editEmploi ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Affichage des messages */}
      {successMessage && (
        <Snackbar
          open={Boolean(successMessage)}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
        />
      )}
    </Box>
  );
}

export default EmploisContent;
