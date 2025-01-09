import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

const EmploiTempsStep = ({ discr, emplois, loading, error, jours }) => (
  <>
    {loading ? (
      <Box textAlign="center" mt={2}>
        <CircularProgress />
        <Typography variant="body2" mt={2}>
          Chargement de l'emploi du temps...
        </Typography>
      </Box>
    ) : error ? (
      <Box textAlign="center" color="error.main" mt={2}>
        <ErrorIcon fontSize="large" />
        <Typography variant="body2">{error}</Typography>
      </Box>
    ) : emplois?.length > 0 ? (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Jour</TableCell>
              <TableCell align="center">Heure Début</TableCell>
              <TableCell align="center">Heure Fin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emplois.map((emploi) => (
              <TableRow key={emploi.Id}>
                <TableCell align="center">{jours[emploi.jour]}</TableCell>
                {discr === "Etudiant" ? (
                  <>
                    <TableCell align="center">{emploi.dateDebut}</TableCell>
                    <TableCell align="center">{emploi.dateFin}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell align="center">{emploi.heureDebut}</TableCell>
                    <TableCell align="center">{emploi.heureFin}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography variant="body2" sx={{ mt: 2 }} textAlign="center">
        Aucun emploi du temps disponible.
      </Typography>
    )}
  </>
);

export default EmploiTempsStep;
