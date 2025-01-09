import React, { useState } from 'react';
import { CreditCard, Lock, Calendar, User, CheckCircle } from 'lucide-react';
import { Box, TextField, Button, Typography, Card, Grid, InputAdornment, IconButton, Alert } from '@mui/material';
import { styled } from '@mui/system';
import ReservationApi from '../../Api/ReservationApi';  

// Styled components for card and fields
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 450,
  margin: 'auto',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: '#fff',
}));

const CreditCardSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to right, #059669, #10b981)',
  color: 'white',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[2],
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    '& fieldset': {
      borderColor: theme.palette.grey[300],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.success.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.success.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.success.main,
  color: '#fff',
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
}));

const ErrorBox = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 'bold',
}));

const SuccessBox = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 'bold',
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.dark,
}));

// Payment Component
function PaymentComponent({ selectedOption, reservationPreview }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission and payment validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = [];

    // Local validation of fields
    if (formData.cardNumber.length !== 16) {
      errors.push('Le numéro de carte doit être de 16 chiffres.');
    }
    if (formData.cardHolder.trim() === '') {
      errors.push("Le titulaire de la carte est requis.");
    }
    if (!formData.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      errors.push("La date d'expiration doit être au format MM/AA.");
    }
    if (formData.cvv.length !== 3) {
      errors.push("Le CVV doit être de 3 chiffres.");
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      setSuccessMessage('');
    } else {
      try {
        // Call payment API
        const response = await ReservationApi.validatePayment(formData);
        if (response.status === 200) {
          setErrorMessages([]);
          setIsConfirmed(true);
          setSuccessMessage('Paiement confirmé avec succès!');
          // Once payment is validated, trigger reservation
          await ReservationApi.confirmReservation(selectedOption, reservationPreview);
        } else {
          throw new Error("Échec du paiement. Veuillez réessayer.");
        }
      } catch (error) {
        setErrorMessages(["Une erreur est survenue pendant le paiement."]);
      }
    }
  };

  // If payment is confirmed, show success message
  if (isConfirmed) {
    return (
      <Box textAlign="center" mt={3}>
        <Typography variant="h6">Votre paiement est confirmé!</Typography>
        <CheckCircle size={48} color="green" sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <StyledCard>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1" fontWeight="bold" color="text.primary">
          Paiement Sécurisé
        </Typography>
        <Lock size={24} color="#059669" />
      </Box>

      <CreditCardSection>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <CreditCard size={32} color="white" />
          <Typography variant="h6" component="p">
            €49.99
          </Typography>
        </Box>
        <Typography variant="body2">**** **** **** 4242</Typography>
        <Typography variant="body2">Valide jusqu'à 12/25</Typography>
      </CreditCardSection>

      {/* Display error or success messages */}
      {errorMessages.length > 0 && (
        <Box>
          {errorMessages.map((message, index) => (
            <ErrorBox key={index} severity="error" variant="filled">
              {message}
            </ErrorBox>
          ))}
        </Box>
      )}

      {successMessage && (
        <Box mb={2}>
          <SuccessBox severity="success" variant="filled">
            {successMessage}
          </SuccessBox>
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <StyledTextField
          color="success"
          fullWidth
          label="Numéro de carte"
          placeholder="1234 5678 9012 3456"
          variant="outlined"
          value={formData.cardNumber}
          onChange={handleChange}
          name="cardNumber"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CreditCard size={20} />
              </InputAdornment>
            ),
          }}
        />

        <StyledTextField
          color="success"
          fullWidth
          label="Titulaire de la carte"
          placeholder="John Doe"
          variant="outlined"
          value={formData.cardHolder}
          onChange={handleChange}
          name="cardHolder"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <User size={20} />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <StyledTextField
              fullWidth
              color="success"
              label="Date d'expiration"
              placeholder="MM/AA"
              variant="outlined"
              value={formData.expiry}
              onChange={handleChange}
              name="expiry"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Calendar size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <StyledTextField
              color="success"
              fullWidth
              label="CVV"
              placeholder="123"
              variant="outlined"
              value={formData.cvv}
              onChange={handleChange}
              name="cvv"
            />
          </Grid>
        </Grid>

        <StyledButton
          type="submit"
          variant="contained"
          fullWidth
          startIcon={<Lock size={20} />}
        >
          Payer maintenant
        </StyledButton>
      </form>

      <Box display="flex" alignItems="center" justifyContent="center" mt={3} color="text.secondary">
        <Lock size={16} />
        <Typography variant="body2" ml={1}>
          Paiement sécurisé par SSL
        </Typography>
      </Box>
    </StyledCard>
  );
}

export default PaymentComponent;
