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
import EtudiantApi from "../Api/EtudiantApi";
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
  { title: "Trimestriel", price: "199.99 MAD / trimestre", description: "Pour un engagement prolongé." },
];

function Emploi({ open, onClose, place }) {
  const [activeStep, setActiveStep] = useState(0);
  const [emplois, setEmplois] = useState(null);
  const [dataE, setDataE] = useState(null);
  const [reservations, setReservations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      const idEtudiant = userData?.id;

      if (!idEtudiant) {
        setError("Impossible de récupérer l'ID de l'étudiant.");
        return;
      }

      setLoading(true);

      try {
        const [emploisData, etudiantData, reservationsData] = await Promise.all([
          EmploiApi.fetchEmploiByIdEtudiant(idEtudiant),
          EtudiantApi.fetchEtudiantById(idEtudiant),
          ReservationApi.fetchReservations(),
        ]);

        setEmplois(emploisData);
        setDataE(etudiantData);
        setReservations(reservationsData);

        if (emploisData.length > 0) {
          setActiveStep(1);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Une erreur s'est produite lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => {
    setActiveStep(0);
    setSelectedOption(null);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle style={{ textAlign: "center", fontWeight: "bold", color: "#1976d2" }}>
        Réservation de Place - Étapes
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" textAlign="center" sx={{ mb: 2, color: "#1976d2" }}>
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
          {/* Étape 1: Afficher l'emploi du temps */}
          {activeStep === 0 && (
            <>
              {loading ? (
                <Box textAlign="center" mt={2}>
                  <CircularProgress />
                  <Typography variant="body2" mt={2}>Chargement de l'emploi du temps...</Typography>
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
                <Typography variant="body2" sx={{ mt: 2 }}>Aucun emploi du temps disponible.</Typography>
              )}
            </>
          )}

          {/* Étape 2: Options de paiement */}
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
                      cursor: "pointer",
                      "&:hover": { boxShadow: 3 },
                    }}
                    onClick={() => setSelectedOption(index)}
                  >
                    <CardContent>
                      <Typography variant="h6" textAlign="center" color="primary">{option.title}</Typography>
                      <Typography variant="body1" textAlign="center">{option.price}</Typography>
                      <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                        {option.description}
                      </Typography>
                    </CardContent>
                    {selectedOption === index && (
                      <CardActions>
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

          {/* Étape 3: Validation des informations */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
                Vérification des informations
              </Typography>
              <Typography variant="body1"><strong>Email :</strong> {dataE?.email}</Typography>
              <Typography variant="body1"><strong>Lieu :</strong> {place}</Typography>
              <Typography variant="body1"><strong>Heure début :</strong> {emplois?.[0]?.dateDebut}</Typography>
              <Typography variant="body1"><strong>Heure fin :</strong> {emplois?.[0]?.dateFin}</Typography>
              <Typography variant="body1"><strong>Option sélectionnée :</strong> {selectedOption ? paymentOptions[selectedOption].title : "Aucune"}</Typography>
            </Box>
          )}

          {/* Étape 4: Confirmation finale */}
          {activeStep === steps.length - 1 && (
            <Box textAlign="center" mt={2}>
              <CheckCircleIcon fontSize="large" color="success" />
              <Typography variant="h6" color="success.main" mt={2}>
                Réservation confirmée avec succès !
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
          Retour
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleReset} variant="contained" color="primary">
            Réinitialiser
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained" color="primary">
            {activeStep === steps.length - 2 ? "Confirmer" : "Suivant"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default Emploi;
