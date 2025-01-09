import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import './About.css'
const AboutPage = () => {
    const membres = {
        'Ahmed': "Gardien de voitures de EMSI ORANGERS",
        'Amine&Med': "Développeurs d'application PARKING EMSI",
        'Essaaidi': "Directeur de EMSI CASABLANCA"
      };
  return (
    <div style={{marginTop: "64px"}}>
<Box sx={{ padding: '50px', backgroundColor: 'white', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box
        sx={{
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'rgb(8, 151, 66)' }}>
          À propos de nous
        </Typography>
        <Typography sx={{ marginTop: '10px', fontSize: '1.2rem', color: '#555' }}>
          Découvrez notre mission et les objectifs de notre plateforme.
        </Typography>
      </Box>

      {/* About Content Section */}
      <Grid container spacing={4} alignItems="center">
        {/* Left Section: Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: '300px',
              backgroundImage: 'url(/images/img1.jpeg)', // Remplacez par le chemin d'une image
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '10px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          ></Box>
        </Grid>

        {/* Right Section: Text */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            Notre Vision
          </Typography>
          <Typography sx={{ marginBottom: '15px', fontSize: '1rem', lineHeight: '1.8', color: '#555' }}>
            Nous croyons en une expérience de stationnement simplifiée et efficace pour tous. Notre plateforme a
            été développée avec un objectif clair : réduire le stress des utilisateurs et optimiser la gestion des
            ressources disponibles. Avec une technologie avancée et une interface intuitive, nous vous offrons un
            service qui répond à vos besoins.
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'rgb(8, 151, 66)',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgb(6, 120, 52)',
              },
            }}
          >
            En savoir plus
          </Button>
        </Grid>
      </Grid>
      <Box
          sx={{
            height: "4px",
            width: "200px",
            background: "linear-gradient(90deg,#008d36,#008d36)",
            margin: "40px auto 0 auto",
            borderRadius: "8px",
          }}
        ></Box>
      {/* Team Section */}
      <Box sx={{ marginTop: '50px', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
          Notre Équipe
        </Typography>
        <Typography sx={{ marginBottom: '40px', fontSize: '1rem', color: '#555' }}>
          Rencontrez les personnes qui rendent tout cela possible.
        </Typography>

        {/* Team Members */}
        

<Grid container spacing={2}>
  {Object.keys(membres).map((member) => (
    <Grid item xs={12} sm={6} md={4} key={member}>
      <Box
        sx={{
          height: '200px',
          backgroundImage: `url(/images/${member.toLowerCase()}.jpg)`, // Exemple: ahmed.jpg
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      ></Box>
      <Typography variant="h6" sx={{ marginTop: '15px', fontWeight: 'bold', color: '#333' }}>
        {member}
      </Typography>
      <Typography sx={{ color: '#777', fontSize: '0.9rem' }}>
        {membres[member]}
      </Typography>
    </Grid>
  ))}
</Grid>

      </Box>
    </Box>
    {/* lignes */}
    <Box
          sx={{
            height: "4px",
            width: "200px",
            background: "linear-gradient(90deg,#008d36,#008d36)",
            margin: "40px auto 0 auto",
            borderRadius: "8px",
          }}
        ></Box>
      {/* Payment Information Section */}
      <Box sx={{ marginTop: '30px', textAlign: 'center', padding: '40px', backgroundColor: '#fff',  }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
          Options de paiement
        </Typography>
        <Typography sx={{ marginBottom: '40px', fontSize: '1rem', color: '#555' }}>
          Choisissez la formule qui correspond le mieux à vos besoins pour un stationnement sans souci.
        </Typography>

        {/* Payment Plans */}
        <Grid container spacing={4}>
          {/* Weekly Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                padding: '20px',
                border: '1px solid rgb(8, 151, 66)',
                borderRadius: '10px',
                textAlign: 'center',
                '&:hover': {
                  boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgb(8, 151, 66)', marginBottom: '10px' }}>
                Hebdomadaire
              </Typography>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
            19.99 MAD / semaine
              </Typography>
              <Typography sx={{ color: '#777', fontSize: '0.9rem', marginBottom: '20px' }}>
                Parfait pour des besoins temporaires.
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  color: 'rgb(8, 151, 66)',
                  borderColor: 'rgb(8, 151, 66)',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgb(8, 151, 66)',
                  },
                }}
              >
                Choisir
              </Button>
            </Box>
          </Grid>

          {/* Monthly Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                padding: '20px',
                border: '1px solid rgb(8, 151, 66)',
                borderRadius: '10px',
                textAlign: 'center',
                '&:hover': {
                  boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgb(8, 151, 66)', marginBottom: '10px' }}>
                Mensuel
              </Typography>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                59.99 MAD / mois
              </Typography>
              <Typography sx={{ color: '#777', fontSize: '0.9rem', marginBottom: '20px' }}>
                Idéal pour un usage régulier.
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  color: 'rgb(8, 151, 66)',
                  borderColor: 'rgb(8, 151, 66)',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgb(8, 151, 66)',                  },
                }}
              >
                Choisir
              </Button>
            </Box>
          </Grid>

          {/* Quarterly Plan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                padding: '20px',
                border: '1px solid rgb(8, 151, 66)',
                borderRadius: '10px',
                textAlign: 'center',
                '&:hover': {
                  boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgb(8, 151, 66)', marginBottom: '10px' }}>
              Trimestriel
              </Typography>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
              199.99 MAD / trimestre
              </Typography>
              <Typography sx={{ color: '#777', fontSize: '0.9rem', marginBottom: '20px' }}>
              Solution éco. pour un engagement long terme.
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  color: 'rgb(8, 151, 66)',
                  borderColor: 'rgb(8, 151, 66)',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgb(8, 151, 66)',                  },
                }}
              >
                Choisir
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>




    </div>
    
  );
};

export default AboutPage;
