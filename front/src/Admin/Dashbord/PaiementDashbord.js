import React, { useState, useEffect } from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Pagination } from '@mui/material';
import PaiementApi from '../../Api/PaiementApi';

function PaiementDashboard() {
  const [paiements, setPaiements] = useState([]);
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const placesPerPage = 7;

  const fetchPaiements = async () => {
    try {
      const data = await PaiementApi.fetchPaiements();
      setPaiements(data);
    } catch (error) {
      setErrorMessage('Erreur lors de la récupération des paiements.');
    }
  };

  useEffect(() => {
    fetchPaiements();
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const displayedPaiements = paiements.slice((page - 1) * placesPerPage, page * placesPerPage);

  return (
    <Box>
      {errorMessage && <Box color="error.main">{errorMessage}</Box>}
      <Table sx={{ mt: 5 }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold' }}>Nom</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Prénom</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Mode Paiement</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Prix PAYÉ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedPaiements.map((p) => (
            <TableRow key={p.paiementID}>
              <TableCell>{p.nomPersonne}</TableCell>
              <TableCell>{p.prenomPersonne}</TableCell>
              <TableCell>{p.email}</TableCell>
              <TableCell>{p.modePaiement}</TableCell>
              <TableCell>
                <span style={{ 
                  color: '#2e7d32', // Teinte verte attrayante
                  fontWeight: 'bold', // Rendre le prix plus visible
                  fontSize: '16px', // Taille de texte légèrement augmentée
                }}>
                  {p.prixPaye}
                </span>
                <span style={{
                  color: '#66bb6a', // Variante plus claire pour "MAD"
                  fontWeight: '600', // Semi-gras pour différencier
                  marginLeft: '5px', // Espace entre le prix et "MAD"
                }}>
                  MAD
                </span>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(paiements.length / placesPerPage)}
          page={page}
          onChange={handlePageChange}
          color="success"
        />
      </Box>
    </Box>
  );
}

export default PaiementDashboard;
