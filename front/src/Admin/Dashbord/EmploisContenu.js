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
import EmploisPersonnel from "./EmploisPersonel";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreationPersonnelEmploi from "./CreateEmploiPersonel";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function EmploisContent() {
  const [opend, setOpend] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [emplois, setEmplois] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [selectedGroupe, setSelectedGroupe] = useState("");
  const [viewEmplois, setViewEmplois] = useState(false);
  const [open, setOpen] = useState(false);
  const [showEmploisPersonnel, setShowEmploisPersonnel] = useState(false);
  const [isViewingPersonnelEmplois, setIsViewingPersonnelEmplois] = useState(false);
  const [currentEmploi, setCurrentEmploi] = useState({
    jour: "",
    dateDebut: "",
    dateFin: "",
    groupeId: "",
  });
  const [error, setError] = useState("");
  const [editEmploi, setEditEmploi] = useState(null);

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

  const handleGroupeChange = (event) => {
    const groupid = event.target.value;
    setSelectedGroupe(groupid); // Mettre à jour l'état du groupe sélectionné
    setEmplois([]);  // Réinitialiser les emplois
    setError(null);  // Réinitialiser les erreurs
    fetchEmploisForGroup(groupid); // Charger les emplois pour le groupe sélectionné
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
      await EmploiApi.updateEmploi(editEmploi.id, emploiData);
      setSuccessMessage("Emploi mis à jour avec succès.");
      handleClose();
      fetchEmploisForGroup(selectedGroupe); // Recharger la liste après mise à jour
    } catch (error) {
      setError("Erreur lors de la mise à jour de l'emploi.");
    }
  };

  const handleCloseEmploisView = () => {
    setViewEmplois(false);
    setSelectedGroupe("");
    setEmplois([]);
  };

  const handleOpend = () => setOpend(true);
  const handleClosed = () => setOpend(false);

  return (
    <Box sx={{ px: 3, display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#ffffff" }}>
      {!viewEmplois && !isViewingPersonnelEmplois && (
        <div>
          <Button variant="contained" color="success" fullWidth onClick={() => setOpen(true)} sx={{ mb: 4, mt: 8 }}>
            <AddIcon /> Ajouter Emploi
          </Button>
          <Button variant="contained" color="success" fullWidth onClick={() => setViewEmplois(true)} sx={{ mb: 4, mt: 2 }}>
            Afficher Emplois
          </Button>
          <Button variant="contained" color="success" fullWidth onClick={handleOpend} sx={{ mb: 4, mt: 2 }}>
            <AddIcon /> Ajouter Emplois Personnel
          </Button>
          <Button variant="contained" color="success" fullWidth onClick={() => setIsViewingPersonnelEmplois(true)} sx={{ mb: 4, mt: 2 }}>
            Afficher Emplois Personnel
          </Button>
        </div>
      )}

      {isViewingPersonnelEmplois && (
        <Box sx={{ width: "100%" }}>
          <EmploisPersonnel />
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => setIsViewingPersonnelEmplois(false)}
              sx={{
                padding: "10px 20px",
                fontWeight: "bold",
                borderRadius: "8px",
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
              }}
              startIcon={<ArrowBackIcon />}
            >
              Retour
            </Button>
          </Box>
        </Box>
      )}

      {opend && (
        <Box sx={{ width: "100%" }}>
          <CreationPersonnelEmploi open={opend} setOpen={setOpend} />
        </Box>
      )}

      {viewEmplois && (
        <Box sx={{ flexDirection: "column", display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <FormControl sx={{ mb: 2, width: "50%", mt: 2 }}>
            <InputLabel id="select-groupe-label">Sélectionnez un Groupe</InputLabel>
            <Select
              labelId="select-groupe-label"
              value={selectedGroupe}
              onChange={handleGroupeChange}
              fullWidth
              color="success"
            >
              {groupes.map((groupe) => (
                <MenuItem key={groupe.id} value={groupe.id}>
                  {groupe.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {emplois.length > 0 && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Jour</TableCell>
                    <TableCell>Date début</TableCell>
                    <TableCell>Date fin</TableCell>
                    <TableCell>Groupe</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emplois.map((emploi,index) => (
                    <TableRow key={`${emploi.id}-${index}`}>  
                      <TableCell>{jourparnum(emploi.jour)}</TableCell>
                      <TableCell>{emploi.dateDebut}</TableCell>
                      <TableCell>{emploi.dateFin}</TableCell>
                      <TableCell>{fetchgroupId(emploi.groupe_Id)}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleEdit(emploi)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Button variant="contained" color="error" onClick={handleCloseEmploisView} sx={{ mb: 4, mt: 2 }}>
            Retour
          </Button>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editEmploi ? "Modifier l'emploi" : "Ajouter un emploi"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Jour"
            value={currentEmploi.jour}
            onChange={(e) => setCurrentEmploi({ ...currentEmploi, jour: e.target.value })}
            fullWidth
            select
          >
            {jours.map((jour, index) => (
              <MenuItem key={index} value={jour}>
                {jour}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date début"
            type="datetime-local"
            value={currentEmploi.dateDebut}
            onChange={(e) => setCurrentEmploi({ ...currentEmploi, dateDebut: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Date fin"
            type="datetime-local"
            value={currentEmploi.dateFin}
            onChange={(e) => setCurrentEmploi({ ...currentEmploi, dateFin: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Groupe"
            value={currentEmploi.groupeId}
            onChange={(e) => setCurrentEmploi({ ...currentEmploi, groupeId: e.target.value })}
            fullWidth
            select
            sx={{ mt: 2 }}
          >
            {groupes.map((groupe) => (
              <MenuItem key={groupe.id} value={groupe.id}>
                {groupe.nom}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={editEmploi ? handleUpdate : handleSubmit}>
            {editEmploi ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        message={error}
      />
    </Box>
  );
}

export default EmploisContent;
