import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Snackbar,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import EmploisPersonnelApi from "../../Api/EmploisPersonnelApi";
import PersonnelApi from "../../Api/PersonnelApi";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const CreationPersonnelEmploi = ({ open, setOpen}) => {
  const [personnels, setPersonnels] = useState([]);
  const [emploisExistants, setEmploisExistants] = useState([]);
  const [currentEmploi, setCurrentEmploi] = useState({
    jour: "",
    heureDebut: "",
    heureFin: "",
    role: "Enseignant",
    personnelId: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Récupération des personnels
  useEffect(() => {
    fetchPersonnels();
  }, []);

  // Charger les emplois existants lorsqu'un personnel est sélectionné
  useEffect(() => {
    if (currentEmploi.personnelId) {
      fetchEmploisExistants(currentEmploi.personnelId);
    }
  }, [currentEmploi.personnelId]);

  const fetchPersonnels = async () => {
    setLoading(true);
    try {
      const data = await PersonnelApi.fetchPersonnels();
      const filteredPersonnels = data.filter((personnel) =>
        ["enseignant", "autre"].includes(personnel.role.toLowerCase())
      );
      setPersonnels(filteredPersonnels);
    } catch (err) {
      setError("Erreur lors de la récupération des personnels.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmploisExistants = async (personnelId) => {
    setLoading(true);
    try {
      const data = await EmploisPersonnelApi.getEmploiByPersonnel(personnelId);
      setEmploisExistants(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Validation des champs
  const validateFields = () => {
    const { jour, heureDebut, heureFin, personnelId } = currentEmploi;

    if (!jour || !heureDebut || !heureFin || !personnelId) {
      setError("Tous les champs sont obligatoires.");
      return false;
    }

    const jourNum = jours.indexOf(jour);
    if (jourNum === -1) {
      setError("Jour invalide.");
      return false;
    }

    if (
      emploisExistants.some(
        (emploi) => emploi.jour === jourNum
      )
    ) {
      setError("Un emploi existe déjà pour ce jour pour le personnel sélectionné.");
      return false;
    }

    if (heureDebut >= heureFin) {
      setError("L'heure de début doit être antérieure à l'heure de fin.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const emploiData = {
      jour: jours.indexOf(currentEmploi.jour),
      heureDebut: `${currentEmploi.heureDebut}:00`,
      heureFin: `${currentEmploi.heureFin}:00`,
      role: currentEmploi.role,
      personnelId: currentEmploi.personnelId,
    };

    try {
      await EmploisPersonnelApi.createEmploiPersonnel(emploiData);
      setSuccessMessage("Emploi ajouté avec succès !");
      handleClose();
    } catch (err) {
      setError("Erreur lors de l'ajout de l'emploi.");
    }
  };

  const handleClose = () => {
    setOpen(false); 
    setCurrentEmploi({
      jour: "",
      heureDebut: "",
      heureFin: "",
      role: "Enseignant",
      personnelId: "",
    });
    setError("");
    
    
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth >
        <DialogTitle style={{ textAlign: "center" }}>
          Ajouter un Emploi Personnel - Enseignant
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Jour"
            value={currentEmploi.jour}
            onChange={(e) =>
              setCurrentEmploi({ ...currentEmploi, jour: e.target.value })
            }
            select
            fullWidth
            sx={{ mb: 2, mt: 2 }}
          >
            {jours.map((jour, index) => (
              <MenuItem key={index} value={jour}>
                {jour}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Heure de Début"
            value={currentEmploi.heureDebut}
            onChange={(e) =>
              setCurrentEmploi({ ...currentEmploi, heureDebut: e.target.value })
            }
            type="time"
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Heure de Fin"
            value={currentEmploi.heureFin}
            onChange={(e) =>
              setCurrentEmploi({ ...currentEmploi, heureFin: e.target.value })
            }
            type="time"
            fullWidth
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Personnel</InputLabel>
            <Select
              value={currentEmploi.personnelId}
              onChange={(e) =>
                setCurrentEmploi({ ...currentEmploi, personnelId: e.target.value })
              }
              label="Personnel"
            >
              {loading ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                personnels.map((personnel) => (
                  <MenuItem key={personnel.id} value={personnel.id}>
                    {personnel.nom} {personnel.prenom}- {personnel.role}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="Black">
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="success" 
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
        color="success"
      />
    </div>
  );
};

export default CreationPersonnelEmploi;
