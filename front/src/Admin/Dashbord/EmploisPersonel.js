import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import EmploiPersonnelApi from '../../Api/EmploisPersonnelApi'; // Remplacez par le bon chemin
import PersonnelApi from '../../Api/PersonnelApi'; 

const EmploisPersonnel = () => {
  const [emplois, setEmplois] = useState([]);
  const [personnels, setPersonnels] = useState([]);
  const [loading, setLoading] = useState(false); // Désactivé par défaut
  const [error, setError] = useState(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState('');

  // Récupérer les personnels depuis l'API
  const fetchPersonnels = async () => {
    try {
      setLoading(true);
      const data = await PersonnelApi.fetchPersonnels();
      setPersonnels(data);
    } catch (error) {
      setError('Erreur lors de la récupération des personnels.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les emplois pour le personnel sélectionné
  const fetchEmplois = async (personnelId) => {
    setLoading(true);
    try {
      const data = await EmploiPersonnelApi.getEmploiByPersonnel(personnelId);
      setEmplois(data);
    } catch (error) {
      setError('Erreur lors de la récupération des emplois.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les personnels au démarrage
  useEffect(() => {
    fetchPersonnels();
  }, []);

  // Fonction de gestion du changement de sélection
  const handlePersonnelChange = (event) => {
    const personnelId = event.target.value;
    setSelectedPersonnel(personnelId);
    setEmplois([]); // Réinitialiser les emplois
    setError(null); // Réinitialiser les erreurs
    if (personnelId) fetchEmplois(personnelId); // Charger les emplois pour le personnel sélectionné
  };

  // Fonction pour convertir un numéro de jour en nom
  const jourparnum = (jourNum) => {
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return jours[jourNum] || 'Inconnu';
  };

  return (
    <Box padding={3}>
      {/* Sélecteur de personnels */}
      <FormControl  margin="normal" sx={{ mb: 2, width: "50%" ,mt:3}}>
        <InputLabel id="select-personnel-label">Sélectionnez un personnel</InputLabel>
        <Select
          labelId="select-personnel-label"
          value={selectedPersonnel}
          onChange={handlePersonnelChange}
        >
          {personnels.map((personnel) => (
            <MenuItem key={personnel.id} value={personnel.id}>
              {personnel.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Affichage en fonction de l'état */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" marginTop={3}>
          <CircularProgress />
          <Typography variant="h6" color="textSecondary" style={{ marginLeft: '15px' }}>
            Chargement des données...
          </Typography>
        </Box>
      )}

      {!loading && selectedPersonnel && emplois.length === 0 && (
        <Typography variant="h6" color="textSecondary" marginTop={3}>
          Aucun emploi trouvé pour ce personnel.
        </Typography>
      )}

      {!loading && emplois.length > 0 && (
        <TableContainer  component={Paper} sx={{ mt: 2, width: "60%" }}>
          <Table aria-label="table des emplois">
            <TableHead>
              <TableRow>
                <TableCell><strong>Jour</strong></TableCell>
                <TableCell><strong>Heure de début</strong></TableCell>
                <TableCell><strong>Heure de fin</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emplois.map((emploi) => (
                <TableRow key={emploi.id}>
                  <TableCell>{jourparnum(emploi.jour)}</TableCell>
                  <TableCell>{emploi.heureDebut}</TableCell>
                  <TableCell>{emploi.heureFin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default EmploisPersonnel;
