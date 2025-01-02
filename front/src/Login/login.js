import React, { useState } from 'react';
// import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Importer useNavigate
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import SignApi from './inscriptionApi';

const LoginPage = () => {
  // State to manage form input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();  // Utiliser useNavigate à l'intérieur du composant
  const handleSubmit = async (event) => {
    event.preventDefault();  // Empêche le comportement par défaut du formulaire

    const loginData = {
        email: email,  // Récupère l'email de l'utilisateur
        motdepasse: password  // Récupère le mot de passe de l'utilisateur
    };

    try {
        // Envoi des données de connexion à l'API via SignApi.createLogin
        const response = await SignApi.createLogin(loginData);
        console.log('Login successful:', response);

        // Sauvegarde des informations dans le sessionStorage pour maintenir la session
        const userData = {
            discriminator: response.discriminator,
            email: response.email,
            id: response.id,
            role: response.role,
            token: response.token,  // Token d'authentification pour les requêtes sécurisées
        };

        // Sauvegarde dans sessionStorage
        sessionStorage.setItem('userData', JSON.stringify(userData));
        sessionStorage.setItem('jwtToken', response.token);
        console.log('Utilisateur connecté avec succès:', userData);
        setErrorMessage("");

        // Redirection vers "/about" après une connexion réussie
        if (userData.discriminator === 'Admin') {
          // Redirection vers une page vide contenant "Bonjour Admin"
          navigate('/admin');
      } else {
          // Rediriger vers la page "/about" pour les autres utilisateurs
          navigate('/');
      } // Utilisation de navigate ici

    } catch (error) {
        if (error === "Network Error") {
            setErrorMessage("Erreur de connexion au serveur");
        } else {
            setErrorMessage("Invalid email or password");
        }
        console.error('Login error:', error);
    }
};
  

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
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            control={
              <Checkbox
                sx={{ color: 'Black' }}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Se souvenir de moi"
            sx={{ marginBottom: 2, color: 'black', fontWeight: 'bold' }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: 'rgb(29, 125, 61)',
              '&:hover': { backgroundColor: 'rgb(24, 100, 49)' },
              padding: 1.5,
              fontFamily: 'cursive',
            }}
          >
            Se connecter
          </Button>
        </form>

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
              href="/inscription"
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
