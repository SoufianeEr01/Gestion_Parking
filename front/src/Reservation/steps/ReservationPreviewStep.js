import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import ReservationApi from "../../Api/ReservationApi";
import ReservationPersonnelApi from "../../Api/ReservationPerosonnelApi";

const ReservationPreviewStep = ({
  selectedOption,
  setError,
  onReservationPreview,
  place,
  groupe,
  personnelId,
  disc,
}) => {
  const [reservationPreview, setReservationPreview] = useState(null);
  const [reservationPreviewP, setReservationPreviewP] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPreviewFunction = () => {
    switch (selectedOption) {
      case 0:
        return ReservationApi.previewReservationHebdomadaire;
      case 1:
        return ReservationApi.previewReservationMensuelle;
      case 2:
        return ReservationApi.previewReservationSemestrielle;
      default:
        return null;
    }
  };

  const getPreviewFunctionP = () => {
    switch (selectedOption) {
      case 0:
        return ReservationPersonnelApi.previewReservationHebdomadaireP;
      case 1:
        return ReservationPersonnelApi.previewReservationMensuelleP;
      case 2:
        return ReservationPersonnelApi.previewReservationSemestrielleP;
      default:
        return null;
    }
  };

  const getLieuForPlace = (place) => {
    if (place >= 1 && place <= 20) return "étage 1";
    if (place >= 21 && place <= 40) return "étage 2";
    if (place >= 41 && place <= 60) return "étage 3";
    if (place >= 61 && place <= 80) return "étage 4";
    return "étage inconnu";
  };

  useEffect(() => {
    if (disc !== "Etudiant" || selectedOption === null) {
      return;
    }

    const fetchReservationPreview = async () => {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      const reservationRequest = {
        lieu: getLieuForPlace(place),
        personne_id: userData?.id,
      };

      const previewFunction = getPreviewFunction();

      if (previewFunction) {
        setLoading(true);
        try {
          const response = await previewFunction(groupe, place, reservationRequest);
          if (JSON.stringify(response.reservations) !== JSON.stringify(reservationPreview)) {
            setReservationPreview(response.reservations);
            onReservationPreview(response.reservations);
          }
        } catch (error) {
          console.error("Erreur lors de la prévisualisation des réservations :", error);
          setError("Impossible de récupérer les dates des réservations.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReservationPreview();
  }, [disc, selectedOption]);

  useEffect(() => {
    if (disc !== "Personnel" || selectedOption === null) {
      return;
    }

    const fetchReservationPreviewP = async () => {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      const reservationRequest = {
        lieu: getLieuForPlace(place),
        personne_id: userData?.id,
      };

      const previewFunctionP = getPreviewFunctionP();

      if (previewFunctionP) {
        setLoading(true);
        try {
          const response = await previewFunctionP(personnelId, place, reservationRequest);
          if (JSON.stringify(response.reservations) !== JSON.stringify(reservationPreviewP)) {
            setReservationPreviewP(response.reservations);
            onReservationPreview(response.reservations);
          }
        } catch (error) {
          console.error("Erreur lors de la prévisualisation des réservations :", error);
          setError("Impossible de récupérer les dates des réservations.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReservationPreviewP();
  }, [disc, selectedOption]);

  return (
    <Box>
      <Typography textAlign="center" variant="h6" sx={{ mb: 2 }}>
        Dates de réservation prévues
      </Typography>
      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : reservationPreview || reservationPreviewP ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Heure Début</TableCell>
                <TableCell align="center">Heure Fin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(reservationPreview || reservationPreviewP).map((reservation, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{reservation.date}</TableCell>
                  <TableCell align="center">{reservation.heureDebut}</TableCell>
                  <TableCell align="center">{reservation.heureFin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box textAlign="center" color="error.main">
          <ErrorIcon fontSize="large" />
          <Typography>Impossible de charger les réservations.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReservationPreviewStep;
