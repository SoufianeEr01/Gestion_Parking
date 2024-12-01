import React from 'react';

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

const LoginPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f9f4', // Vert clair en fond
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 4,
          backgroundColor: '#FFFFFF',
          borderRadius: 2,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        

        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          fontFamily={"cursive"}
          gutterBottom
          sx={{ color: 'rgb(29, 125, 61)', marginTop: 4 }}
        >
          Parking Manager
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          sx={{ marginBottom: 3 }}
        >
          Connectez-vous pour gérer vos espaces de stationnement
        </Typography>

        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgb(29, 125, 61)',
              },
              '&:hover fieldset': {
                borderColor: 'rgb(24, 100, 49)', // Variation au survol
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgb(29, 125, 61)',
              },
            },
          }}
        />
        <TextField
          fullWidth
          label="Mot de passe"
          type="password"
          margin="normal"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgb(29, 125, 61)',
              },
              '&:hover fieldset': {
                borderColor: 'rgb(24, 100, 49)', // Variation au survol
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgb(29, 125, 61)',
              },
            },
          }}
        />

        <FormControlLabel
          control={<Checkbox sx={{ color: 'Black' }} />}
          label="Se souvenir de moi"
          sx={{ marginBottom: 2, color: 'black', fontWeight: 'bold' }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: 'rgb(29, 125, 61)',
            '&:hover': { backgroundColor: 'rgb(24, 100, 49)' },
            padding: 1.5,
            fontFamily:"cursive"
          }}
        >
          Se connecter
        </Button>

        <Box textAlign="center" marginTop={2}>
          <Link href="#" underline="hover" sx={{ color: 'black', fontWeight: 'bold' }}>
            Mot de passe oublié ?
          </Link>
        </Box>

        <Divider sx={{ marginY: 3, color: 'rgb(29, 125, 61)' }}>ou</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{
            marginBottom: 2,
            borderColor: 'rgb(29, 125, 61)',
            color: 'rgb(29, 125, 61)',
            '&:hover': {
              borderColor: 'rgb(24, 100, 49)',
              backgroundColor: '#e6f2eb',
            },
          }}
        >
          Se connecter avec Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FacebookIcon />}
          sx={{
            borderColor: 'rgb(29, 125, 61)',
            color: 'rgb(29, 125, 61)',
            '&:hover': {
              borderColor: 'rgb(24, 100, 49)',
              backgroundColor: '#e6f2eb',
            },
          }}
        >
          Se connecter avec Facebook
        </Button>

        <Box textAlign="center" marginTop={2}>
          <Typography variant="body2" color="textSecondary">
            Pas de compte ?{' '}
            <Link
              href="#"
              underline="hover"
              sx={{
                color: 'Black',
                fontWeight: 'bold',
                
              }}
            >
              Créez-en un
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;