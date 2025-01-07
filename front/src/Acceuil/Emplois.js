import React, { useState, useEffect } from 'react';
import EmploiPersonnelApi from '../Api/EmploisPersonnelApi'; // Mettez à jour avec le chemin correct
import { Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Grid, Box } from '@mui/material';
import EmploiApi from '../Api/EmploiApi';

const EmploisList = ({ userId , userDisc}) => {
  const [emplois, setEmplois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les emplois
  const fetchEmplois = async () => {
    try {
      setLoading(true);
      if (userDisc === "Personnel") {
        const data = await EmploiPersonnelApi.getEmploiByPersonnel(userId);
        setEmplois(data);
      } else if (userDisc === "Etudiant") {
        const data = await EmploiApi.fetchEmploiByIdEtudiant(userId);
        console.log("Fetched data for Etudiant:", data); // Log the response
        setEmplois(data);
      }
      
      

    } catch (error) {
      setError('Erreur lors de la récupération des emplois.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour récupérer les emplois au démarrage du composant
  useEffect(() => {
    fetchEmplois();
  }, [userId]); // Rechargement si l'ID du personnel change

  const jourparnum = (jourNum) => {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return jours[jourNum] || "Inconnu";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary" style={{ marginLeft: '15px' }}>Chargement des emplois...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" style={{ margin: '20px' }}>{error}</Alert>;
  }

  return (
    <Box padding={1}>
    
      {emplois.length === 0 ? (
        <Typography variant="h6" color="textSecondary">Aucun emploi trouvé pour ce personnel.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={3}>
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
                <TableRow key={emploi.Id}>
                <TableCell>{jourparnum(emploi.jour)}</TableCell>
                
                {userDisc === "Etudiant" ? (
                    <>
                    <TableCell>{emploi.dateDebut}</TableCell>
                    <TableCell>{emploi.dateFin}</TableCell>
                    </>
                ) : (
                    <>
                    <TableCell>{emploi.heureDebut}</TableCell>
                    <TableCell>{emploi.heureFin}</TableCell>
                    </>
                )}
                </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default EmploisList;
