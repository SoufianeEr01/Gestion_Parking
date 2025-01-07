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
  Box,
  Typography,
} from "@mui/material";

import EmploiTempsStep from "./steps/EmploiTempsStep";
import PaymentOptionsStep from "./steps/PaymentOptionsStep";
import ConfirmationStep from "./steps/ConfirmationStep";
import EmploiApi from "../Api/EmploiApi";
import ReservationPreviewStep from "./steps/ReservationPreviewStep";
import ReservationApi from "../Api/ReservationApi";
import EmploiPersonnelApi from "../Api/EmploisPersonnelApi";

const steps = [
  "Afficher l'emploi du temps",
  "Options de paiement",
  "Validation des informations",
  "Confirmation finale",
];

const PlaceReservationDialog = ({ open, onClose, place }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [emplois, setEmplois] = useState(null);
  const [groupe, setGroupe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [reservationPreview, setReservationPreview] = useState(null);
  const [disc, setDisc] = useState(null);

  // Fonction pour mettre à jour reservationPreview depuis le composant enfant
  const handleReservationPreview = (previewData) => {
    setReservationPreview(previewData);
  };

  // Fetch emploi data
  useEffect(() => {
    const fetchEmploiForEtudiant = async () => {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      if (!userData) {
        setError("Utilisateur introuvable.");
        return;
      }

      const idEtudiant = userData?.id;
      setDisc(userData.discriminator); // Directly set disc here

      if (!idEtudiant) {
        setError("Impossible de récupérer l'ID de l'étudiant.");
        return;
      }

      setLoading(true);
      try {
        if (disc === "Etudiant") {
          const data = await EmploiApi.fetchEmploiByIdEtudiant(idEtudiant);
          setEmplois(data);
          setGroupe(data[0]?.groupe_Id);
          setError("");
        } else if (disc === "Personnel") {
          const data = await EmploiPersonnelApi.getEmploiByPersonnel(idEtudiant);
          setEmplois(data);
          setGroupe(data[0]?.groupe_Id);
          setError("");
        }
      } catch (err) {
        setError("Les emplois pour cet utilisateur ne sont pas disponibles.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmploiForEtudiant();
  }, [disc]); // Add `disc` as a dependency to re-fetch data on change

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
    setActiveStep(0);
    setSelectedOption(null);
    setReservationPreview(null); // Reset preview on finalize
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleFinalize} fullWidth maxWidth="md">
      <DialogTitle>Réservation de Place - Étapes</DialogTitle>
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
            <EmploiTempsStep
              discr={disc}
              emplois={emplois}
              loading={loading}
              error={error}
              jours={["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]}
            />
          )}
          {activeStep === 1 && (
            <PaymentOptionsStep
              paymentOptions={[
                { title: "Hebdomadaire", price: "19.99 MAD / semaine", description: "Parfait pour des besoins temporaires." },
                { title: "Mensuel", price: "59.99 MAD / mois", description: "Idéal pour un usage régulier." },
                { title: "Semestriel", price: "199.99 MAD / trimestre", description: "Pour un engagement prolongé." },
              ]}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          )}
          {activeStep === 2 && (
            <ReservationPreviewStep
              selectedOption={selectedOption}
              place={place}
              groupe={groupe}
              setError={setError}
              onReservationPreview={handleReservationPreview} // Passer la fonction ici
            />
          )}
          {activeStep === 3 && <ConfirmationStep />}
        </Box>
      </DialogContent>
      <DialogActions>
        {activeStep > 0 && <Button onClick={handleBack}>Précédent</Button>}
        <Button
          onClick={activeStep === steps.length - 1 ? handleFinalize : handleNext}
          variant="contained"
          disabled={activeStep === 1 && selectedOption === null}
        >
          {activeStep === steps.length - 1 ? "Finaliser" : "Suivant"}
        </Button>
        <Button onClick={handleFinalize} color="secondary">Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlaceReservationDialog;
