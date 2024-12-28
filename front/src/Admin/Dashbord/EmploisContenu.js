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
  Snackbar,
} from "@mui/material";
import GroupApi from "../../Api/GroupApi";
import EmploiApi from "../../Api/EmploiApi";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function EmploisContent() {
  const [successMessage, setSuccessMessage] = useState("");
  const [emplois, setEmplois] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [selectedGroupe, setSelectedGroupe] = useState(""); // Groupe sélectionné
  const [viewEmplois, setViewEmplois] = useState(false); // Contrôle de l'affichage des emplois
  const [open, setOpen] = useState(false);
  const [currentEmploi, setCurrentEmploi] = useState({
    jour: "",
    dateDebut: "",
    dateFin: "",
    groupeId: "",
  });
  const [error, setError] = useState("");

  // Charger les groupes depuis l'API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await GroupApi.fetchGroups(); // Appel API pour récupérer les groupes
        setGroupes(data); // Mettre à jour la liste des groupes
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

  // Fonction pour récupérer les emplois pour un groupe
  const fetchEmploisForGroup = async (groupeId) => {
    try {
      const data = await EmploiApi.fetchEmploisByGroupe(groupeId); // Appel API pour récupérer les emplois
      setEmplois(data); // Mettre à jour les emplois avec les données reçues
    } catch (error) {
      console.error("Erreur lors du chargement des emplois:", error);
      setError("Les emplois ne sont pas disponibles pour ce groupe .");
    }
  };

  // Afficher les emplois
  const handleShowEmplois = () => {
    if (selectedGroupe) {
      fetchEmploisForGroup(selectedGroupe); // Récupérer les emplois pour le groupe sélectionné
      setViewEmplois(true); // Afficher les emplois
    } else {
      setError("Veuillez sélectionner un groupe.");
    }
  };

  const handleGroupeChange = (event) => {
    setSelectedGroupe(event.target.value);
    setError(""); // Réinitialiser l'erreur lorsque le groupe change
  };

  const jourparnum=( jourNum) =>{
    if(jourNum === 0) return "Lundi";
    if(jourNum === 1) return "Mardi";
    if(jourNum === 2) return "Mercredi";
    if(jourNum === 3) return "Jeudi";
    if(jourNum === 4) return "Vendredi";
    if(jourNum === 5) return "Samedi";
  }
  
  // Gérer la soumission du formulaire
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

    // Format des heures en "HH:MM:SS"
    const emploiData = {
      jour: jourNum,
      dateDebut: currentEmploi.dateDebut + ":00", // Ajouter ":00" pour correspondre au format "HH:MM:SS"
      dateFin: currentEmploi.dateFin + ":00",     // Ajouter ":00" pour correspondre au format "HH:MM:SS"
      groupe_Id: currentEmploi.groupeId,
    };

    try {
      const newEmploi = await EmploiApi.createEmploi(emploiData);
      setSuccessMessage("Emploi ajouter avec succès !");
      handleClose(); // Fermer le formulaire
    } catch (error) {
      setError("Erreur lors de l'ajout de l'emploi. Veuillez réessayer.");
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <Box sx={{  px: 3, display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#ffffff" }}>
      {/* <Typography variant="h4" fontWeight="bold" gutterBottom>
        Gestion des Emplois
      </Typography> */}
      {/* <Divider sx={{ width: "100%", my: 2 }} /> */}

      {/* Affichage des boutons initialement */}
      {!viewEmplois && (
        <div >
           <Button variant="contained" color="success" onClick={() => setOpen(true)} sx={{ mb: 3 ,display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
           + Ajouter Emplois
           </Button>
          <Button variant="contained" color="success"  onClick={() => setViewEmplois(true)} sx={{ mb: 18,alignItems: 'center' }}>
            Afficher Emplois
          </Button>
          
        </div>
      )}

      {/* Affichage de la sélection de groupe après avoir cliqué sur "Afficher Emplois" */}
      {viewEmplois && (
        <>
          <FormControl sx={{ mb: 2, width: "50%"  }}>
            <InputLabel id="select-groupe-label">Sélectionnez un Groupe</InputLabel>
            <Select labelId="select-groupe-label" value={selectedGroupe} onChange={handleGroupeChange} fullWidth>
              <MenuItem value="">Sélectionner un groupe</MenuItem>
              {groupes.map((groupe) => (
                <MenuItem key={groupe.id} value={groupe.id}>
                  {groupe.nom} {/* Remplacez "nom" par la propriété appropriée dans votre objet groupe */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button variant="contained" color="success" onClick={handleShowEmplois} sx={{ mb: 2 }}>
            Afficher les Emplois
          </Button>
          
        </>
      )}

      {/* Affichage des emplois pour le groupe sélectionné */}
      {emplois.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2, width: "90%" }} >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ fontWeight: "bold" }}>Jour</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>Heure de Début</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>Heure de Fin</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>Groupe</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {emplois.map((emploi) => (
                <TableRow key={emploi.id}>
                  <TableCell align="center">{jourparnum(emploi.jour)}</TableCell>
                  <TableCell align="center">{emploi.dateDebut}</TableCell>
                  <TableCell align="center">{emploi.dateFin}</TableCell>
                  <TableCell align="center">{fetchgroupId(emploi.groupe_Id)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog pour ajouter un emploi */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Ajouter un Emploi</DialogTitle>
        <DialogContent>
          <TextField
          color="success"
            select
            label="Jour"
            name="jour"
            value={currentEmploi.jour}
            onChange={(e) => setCurrentEmploi({ ...currentEmploi, jour: e.target.value })}
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
          color="success"
            type="time"
            label="Heure de Début"
            name="dateDebut"
            value={currentEmploi.dateDebut}
            onChange={(e) => setCurrentEmploi({ ...currentEmploi, dateDebut: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
          color="success"
            type="time"
            label="Heure de Fin"
            name="dateFin"
            value={currentEmploi.dateFin}
            onChange={(e) => setCurrentEmploi({ ...currentEmploi, dateFin: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
          color="success"
            select
            label="Groupe"
            name="groupeId"
            value={currentEmploi.groupeId}
            onChange={(e) => setCurrentEmploi({ ...currentEmploi, groupeId: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          >
            {groupes.map((groupe) => (
              <MenuItem key={groupe.id} value={groupe.id}>
                {groupe.nom}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="black">
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="success" variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
              open={!!successMessage}
              autoHideDuration={3000}
              onClose={() => setSuccessMessage("")}
              message={successMessage}
            />
       <Snackbar
              open={!!error}
              autoHideDuration={3000}
              onClose={() => setError("")}
              message={error}
            />
    </Box>
  );
}

export default EmploisContent;
