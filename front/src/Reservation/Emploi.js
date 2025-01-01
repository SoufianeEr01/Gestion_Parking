import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stepper,
  Step,
  StepLabel,
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
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import EmploiApi from "../Api/EmploiApi";
import ReservationApi from "../Api/ReservationApi";

const steps = [
  "Afficher l'emploi du temps",
  "Options de paiement",
  "Validation des informations",
  "Confirmation finale",
];

const paymentOptions = [
  { title: "Hebdomadaire", price: "19.99 MAD / semaine", description: "Parfait pour des besoins temporaires." },
  { title: "Mensuel", price: "59.99 MAD / mois", description: "Idéal pour un usage régulier." },
  { title: "Semestriel", price: "199.99 MAD / trimestre", description: "Pour un engagement prolongé." },
];

function Emploi({ open, onClose, place }) {
  const [activeStep, setActiveStep] = useState(0);
  const [emplois, setEmplois] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [reservationPreview, setReservationPreview] = useState(null);

  useEffect(() => {
    const fetchEmploiForEtudiant = async () => {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      const idEtudiant = userData?.id;

      if (!idEtudiant) {
        setError("Impossible de récupérer l'ID de l'étudiant.");
        return;
      }

      setLoading(true);
      setEmplois(null);
      try {
        const data = await EmploiApi.fetchEmploiByIdEtudiant(idEtudiant);
        setEmplois(data);
        setError("");
        if (data.length > 0) {
          setActiveStep(0);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des emplois:", err.message);
        setError("Les emplois pour cet étudiant ne sont pas disponibles.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmploiForEtudiant();
  }, []);

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

  useEffect(() => {
    if (activeStep === 2 && selectedOption !== null) {
      const fetchReservationPreview = async () => {
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        const reservationRequest = {
          lieu: "etage 1", // Remplacez par la valeur réelle si différente
          personne_id: userData?.id, // Récupérer l'utilisateur actuel
        };

        const previewFunction = getPreviewFunction();

        if (previewFunction) {
          try {
            const response = await previewFunction(
              1, // Remplacez par l'ID du groupe réel
              1, // Remplacez par l'ID de la place réelle
              reservationRequest
            );
            setReservationPreview(response.reservations);
          } catch (error) {
            console.error("Erreur lors de la prévisualisation des réservations :", error);
            setError("Impossible de récupérer les dates des réservations.");
          }
        }
      };

      fetchReservationPreview();
    }
  }, [activeStep, selectedOption]);

  const handleNext = async () => {
    if (activeStep === 2) {
      // Confirm reservations for the selected payment option
      if (selectedOption === 0) {
        await ReservationApi.confirmReservationHebdomadaire(reservationPreview);
      } else if (selectedOption === 1) {
        await ReservationApi.confirmReservationMensuelle(reservationPreview);
      } else if (selectedOption === 2) {
        await ReservationApi.confirmReservationSemestrielle(reservationPreview);
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFinalize = () => {
    // Reset all states before closing and close the dialog
    setActiveStep(0);
    setSelectedOption(null);
    setReservationPreview(null);
    setError("");
    onClose(); // Close the dialog immediately
  };

  return (
    <Dialog open={open} onClose={handleFinalize} fullWidth maxWidth="md">
      <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
        Réservation de Place - Étapes
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
          Place sélectionnée : <strong>{place}</strong>
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {activeStep === 0 && (
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
                        <TableRow key={emploi.id}>
                          <TableCell align="center">{emploi.jour}</TableCell>
                          <TableCell align="center">{emploi.dateDebut}</TableCell>
                          <TableCell align="center">{emploi.dateFin}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Aucun emploi du temps disponible.
                </Typography>
              )}
            </>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
                Options de paiement
              </Typography>
              <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
                {paymentOptions.map((option, index) => (
                  <Card
                    key={index}
                    sx={{
                      minWidth: 275,
                      border: selectedOption === index ? "2px solid #1976d2" : "1px solid #ccc",
                      transition: "0.3s",
                      cursor: 'pointer',
                    }}
                    onClick={() => { setSelectedOption(index); }}
                  >
                    <div>
                      <CardContent>
                        <Typography variant="h6" textAlign="center" color="primary">
                          {option.title}
                        </Typography>
                        <Typography variant="body1" textAlign="center">
                          {option.price}
                        </Typography>
                        <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                          {option.description}
                        </Typography>
                      </CardContent>
                    </div>

                    {selectedOption === index && (
                      <CardActions sx={{ cursor: 'pointer' }}>
                        <Typography textAlign="center" color="success.main" sx={{ width: "100%" }}>
                          Sélectionné
                        </Typography>
                      </CardActions>
                    )}
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography textAlign="center" variant="h6" sx={{ mb: 2 }}>
                Dates de réservation prévues
              </Typography>
              {reservationPreview ? (
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
                      {reservationPreview.map((reservation, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{reservation.date}</TableCell>
                          <TableCell align="center">{reservation.heureDebut}</TableCell>
                          <TableCell align="center">{reservation.heureFin}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : error ? (
                <Typography textAlign="center" color="error.main">
                  {error}
                </Typography>
              ) : (
                <CircularProgress />
              )}
            </Box>
          )}

          {activeStep === 3 && (
            <Box textAlign="center" mt={3}>
              <Typography variant="h6">
                Votre réservation est confirmée!
              </Typography>
              <CheckCircleIcon fontSize="large" sx={{ color: "green", mt: 2 }} />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        {activeStep > 0 && (
          <Button onClick={handleBack} color="primary">
            Précédent
          </Button>
        )}
        <Button
          onClick={activeStep === steps.length - 1 ? handleFinalize : handleNext }
          color="primary"
          variant="contained"
          disabled={selectedOption === null && activeStep === 1}
        >
          {activeStep === steps.length - 1 ? "Finaliser" : "Suivant"}
        </Button>
        <Button onClick={handleFinalize} color="secondary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Emploi;
