import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = ['Step 1: Introduction', 'Step 2: Information', 'Step 3: Validation', 'Step 4: Confirmation'];

function Emploi({ open, onClose, placeNumber }) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle style={{textAlign:"center"}}>Etape Pour Reserver Une Place</DialogTitle>
      <DialogContent>
        <p>Place sélectionnée : {placeNumber}</p> {/* Affichage du numéro de la place */}

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div style={{ marginTop: '20px' }}>
          {activeStep === steps.length ? (
            <div>
              <p>Toutes les étapes sont complétées !</p>
            </div>
          ) : (
            <div>
              <p>{`Contenu de l'étape ${activeStep + 1}: ${steps[activeStep]}`}</p>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button disabled={activeStep === 0} onClick={handleBack}>Retour</Button>
        {activeStep === steps.length ? (
          <Button onClick={handleReset}>Réinitialiser</Button>
        ) : (
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
          </Button>
        )}
        <Button onClick={onClose} color="secondary">Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Emploi;
