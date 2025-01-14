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
  Typography,
  
  
} from "@mui/material";
import GroupApi from "../../Api/GroupApi";
import EmploiApi from "../../Api/EmploiApi";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmploisPersonnel from "./EmploisPersonel";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreationPersonnelEmploi from "./CreateEmploiPersonel";
import SearchIcon from '@mui/icons-material/Search';
import  {Grid}  from '@mui/material';


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
    id: "",
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
      const joursOrdre = [0, 1, 2, 3, 4, 5];
      const filteredAndSortedData = data
        .filter(emploi => joursOrdre.includes(emploi.jour)) 
        .sort((a, b) => a.jour - b.jour); 
      setEmplois(filteredAndSortedData);
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
  

  const handleToggleEmploisPersonnel = () => {
    setShowEmploisPersonnel(!showEmploisPersonnel); // Basculer l'état
  };

  const handleGroupeChange = (event) => {
    const groupid = event.target.value; 
    setSelectedGroupe(groupid);
    setEmplois([]); // Réinitialiser les emplois
    setError(null); // Réinitialiser les erreurs
    if (groupid) fetchEmploisForGroup(groupid);
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
      handleClosed();
    } catch (error) {
      setError("Erreur lors de l'ajout de l'emploi.");
    }
  };

  const handleClose = () => setOpen(false);


  // Fonction pour éditer un emploi
  const handleEdit = (emploi) => {
    console.log("Emploi à éditer : ", emploi); // Afficher l'objet emploi
    setEditEmploi(emploi);
    setCurrentEmploi({
      id: emploi.id, // Assurez-vous que l'ID est bien récupéré ici
      jour: jours[emploi.jour],
      dateDebut: emploi.dateDebut.split(":")[0] + ":" + emploi.dateDebut.split(":")[1],
      dateFin: emploi.dateFin.split(":")[0] + ":" + emploi.dateFin.split(":")[1],
      groupeId: emploi.groupe_Id,
    });
    setOpen(true);
  };
  
  const handleUpdate = async () => {
    setError(""); // Réinitialiser les erreurs
    
    if (!currentEmploi.jour || !currentEmploi.dateDebut || !currentEmploi.dateFin || !currentEmploi.groupeId) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
  
    // Convertir le jour en numéro
    const jourNum = jours.indexOf(currentEmploi.jour);
    if (jourNum === -1) {
      setError("Jour invalide.");
      return;
    }
  
    const emploiData = {
      id:currentEmploi.id,
      jour: jourNum,
      dateDebut: `${currentEmploi.dateDebut}:00`,
      dateFin: `${currentEmploi.dateFin}:00`,
      groupe_Id: currentEmploi.groupeId,
    };
  
    try {

      // Appel API pour mettre à jour l'emploi avec l'ID
      await EmploiApi.updateEmploi(editEmploi.id, emploiData);
      // Succès
      setSuccessMessage("Emploi mis à jour avec succès.");
      handleClosed(); // Fermer la boîte de dialogue
      fetchEmploisForGroup(selectedGroupe); // Recharger les emplois du groupe sélectionné
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'emploi :", error);
      setError("Erreur lors de la mise à jour de l'emploi. Veuillez réessayer.");
    }
  };
  
  const handleCloseEmploisView = () => {
    setViewEmplois(false); // Fermer la vue des emplois
    setSelectedGroupe(""); // Réinitialiser le groupe sélectionné
    setEmplois([]); // Vider la liste des emplois
  };
  
//creation de lemplois personnel
  const handleOpend = () => {
    setOpend(true);
  };
  const handleClosed = () => {
    setOpen(false); 
    setCurrentEmploi({
      id: "",
      jour: "",
      dateDebut: "",
      dateFin: "",
      groupeId: "",
    });
    setEditEmploi(null);
    setError("");
  };



  return (
  <Box sx={{ px: 3, display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#ffffff" }}>
    {!viewEmplois && !isViewingPersonnelEmplois && (
      <div>
      <Grid container spacing={6} sx={{ mt: 8}}>
        <Grid item xs={12} md={6} >
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={() => setOpen(true)}
            sx={{ height: 120 }}
          >
            <AddIcon sx={{ mr: 1 }} /> Ajouter Emploi Etudiant
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={() => setViewEmplois(true)}
            sx={{ height: 120 }}
          >
            <SearchIcon sx={{ mr: 1 }} /> Afficher Emplois Etudiant
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={() => setOpend(true)}
            sx={{ height: 120 }}
          >
            <AddIcon sx={{ mr: 1 }} /> Ajouter Emplois Personnel
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={() => setIsViewingPersonnelEmplois(true)}
            sx={{ height: 120 }}
          >
             <SearchIcon sx={{ mr: 1 }} /> Afficher Emplois Personnel
          </Button>
        </Grid>
      </Grid>
    </div>
    )}

    {isViewingPersonnelEmplois && (
      <Box sx={{ width: "100%" }}>
        <EmploisPersonnel />
        <Box sx={{  display: "flex",justifyContent: "center",alignItems: "center",}}>
        <Button
          variant="contained" // Changer en "contained" pour un bouton plus visible
          color="error"
          onClick={() => setIsViewingPersonnelEmplois(false)}
          sx={{
            padding: "10px 20px", // Ajout de l'espacement intérieur
            fontWeight: "bold", // Rendre le texte plus visible
            borderRadius: "8px", // Ajouter des coins arrondis
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)", // Ajout d'une ombre pour l'effet 3D
          }}
          startIcon={<ArrowBackIcon />}
        >
          Retour
        </Button>

      </Box>
      </Box>
    )}
    {
      opend && (
        <Box sx={{ width: "100%" }}>
        <CreationPersonnelEmploi open={opend} setOpen={setOpend} />

        </Box>
      
      )
    }

    {viewEmplois && (
  <Box sx={{ flexDirection: "column",display: "flex",justifyContent: "center",alignItems: "center",width: "100%" }}>
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

          {emplois.length > 0 ? (
        <TableContainer component={Paper} sx={{mt: 1, width: "80%", maxHeight: "460px", fontSize: "0.8rem"}}>
        <Table size="small" sx={{ "& .MuiTableCell-root": { padding: "13px", fontSize: "0.90rem" } }}>
        <TableHead>
              <TableRow>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Jour
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Heure de Début
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Heure de Fin
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Groupe
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emplois.map((emploi) => (
                <TableRow key={emploi.id}>
                <TableCell align="center">{jourparnum(emploi.jour)}</TableCell>
                <TableCell align="center">{emploi.dateDebut}</TableCell>
                <TableCell align="center">{emploi.dateFin}</TableCell>
                <TableCell align="center">
                  {fetchgroupId(emploi.groupe_Id)}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(emploi)} color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  {/* <IconButton
                    onClick={() => handleDelete(emploi.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton> */}
                </TableCell>
              </TableRow>

              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="h6"
          align="center"
          sx={{ mt: 4, color: "gray", fontStyle: "italic" }}
        >
                Aucun emploi trouvé pour ce groupe.
        </Typography>
      )}



    <Button
          variant="contained" // Changer en "contained" pour un bouton plus visible
          color="error"
          onClick={() => handleCloseEmploisView()}
          sx={{
            mt: 3,
            padding: "10px 20px", // Ajout de l'espacement intérieur
            fontWeight: "bold", // Rendre le texte plus visible
            borderRadius: "8px", // Ajouter des coins arrondis
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)", // Ajout d'une ombre pour l'effet 3D
          }}
          startIcon={<ArrowBackIcon />}
        >
          Retour
        </Button>

  </Box>

  
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

