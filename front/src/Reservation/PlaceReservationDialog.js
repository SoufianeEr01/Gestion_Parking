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
import PaymentCard from "./steps/PaymentCard";

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
  const [personnelId, setPersonnelId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [reservationPreview, setReservationPreview] = useState(null);
  const [disc, setDisc] = useState(null);
  const [hasExistingReservation, setHasExistingReservation] = useState(false);

  // Vérifier si une réservation existe
  useEffect(() => {
    const checkExistingReservation = async () => {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      if (!userData) {
        setError("Utilisateur introuvable.");
        return;
      }

      const idEtudiant = userData?.id;
      setPersonnelId(idEtudiant);
      setDisc(userData.discriminator);

      if (idEtudiant) {
        try {
          const exists = await ReservationApi.existingReservation(idEtudiant);
          setHasExistingReservation(exists); // Si true, il y a une réservation active
        } catch (err) {
          setError("Erreur lors de la vérification de la réservation.");
        }
      }
    };

    if (open) {
      checkExistingReservation(); // Vérifier dès l'ouverture du dialogue
    }
  }, [open, disc]);

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
      setPersonnelId(idEtudiant);
      setDisc(userData.discriminator);

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
  }, [disc]);

  const handleNext = async () => {
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
        {hasExistingReservation ? (
          <Typography variant="h6" color="error" textAlign="center">
            Vous avez déjà une réservation active.
          </Typography>
        ) : (
          <>
            <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
              Place sélectionnée : <strong>{place}</strong>
            </Typography>
            <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: '#008D36', // Couleur des étapes terminées
                  },
                  '& .MuiStepLabel-root .Mui-active': {
                    color: '#008D36', // Couleur de l'étape active
                  },
                  '& .MuiStepLabel-root .MuiStepIcon-text': {
                    fill: '#ffffff', // Couleur du texte dans l'icône
                  },
                }}
              >
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
                    { title: "Semestriel", price: "199.99 MAD / semestre", description: "Pour un engagement prolongé." },
                  ]}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                />
              )}
              {activeStep === 2 && (
                <ReservationPreviewStep
                  selectedOption={selectedOption}
                  place={place}
                  disc={disc}
                  groupe={groupe}
                  personnelId={personnelId}
                  setError={setError}
                  onReservationPreview={handleReservationPreview} // Passer la fonction ici
                />
              )}
              {activeStep === 3 && (
                <PaymentCard
                  selectedOption={selectedOption}
                  reservationPreview={reservationPreview}
                  price={
                    selectedOption === 0
                      ? "19.99"
                      : selectedOption === 1
                      ? "59.99"
                      : "199.99"
                  }
                  modePaiement={
                    selectedOption === 0
                      ? "hebdomadaire"
                      : selectedOption === 1
                      ? "mensuelle"
                      : "semestrielle"
                  }
                  onClose={handleFinalize} // Passer handleFinalize ici
                />
              )}
            </Box>
          </>
        )}
      </DialogContent>
            {  activeStep !== 3 && !hasExistingReservation?
      
      <DialogActions>
  {activeStep > 0 && (
    <Button
      onClick={handleBack}
      sx={{
        color: '#008D36', // Texte en vert
        borderColor: '#008D36', // Bordure verte (si vous ajoutez `variant="outlined"`)
      }}
    >
      Précédent
    </Button>
  )}
  <Button
    onClick={activeStep === steps.length - 1 ? handleFinalize : handleNext}
    variant="contained"
    sx={{
      backgroundColor: '#008D36', // Fond vert
      color: '#FFFFFF', // Texte blanc
      '&:hover': {
        backgroundColor: '#006B28', // Vert plus foncé au survol
      },
    }}
    disabled={activeStep === 1 && selectedOption === null}
  >
    {activeStep === steps.length - 1 ? "Finaliser" : "Suivant"}
  </Button>
  <Button
    onClick={handleFinalize}
    sx={{
      color: '#FFFFFF', // Texte blanc
      backgroundColor: '#B0B0B0', // Gris clair
      '&:hover': {
        backgroundColor: '#8D8D8D', // Gris plus foncé au survol
      },
    }}
  >
    Fermer
  </Button>
</DialogActions>
    
      :<DialogActions>
        <Button onClick={handleFinalize} variant="contained" color="error">Annuler</Button>
        </DialogActions>
    }
    </Dialog>
  );
};

export default PlaceReservationDialog;
