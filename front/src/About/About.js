import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './About.css';

const AboutPage = () => {
  const navigate = useNavigate();

  const membres = {
    Ahmed: "Gardien de voitures de EMSI ORANGERS",
    "Soufiane&Larbi": "Développeurs d'application PARKING EMSI",
    Essaaidi: "Directeur de EMSI CASABLANCA",
  };

  const paymentPlans = [
    {
      title: "Hebdomadaire",
      price: "19.99 MAD / semaine",
      description: "Parfait pour des besoins temporaires.",
    },
    {
      title: "Mensuel",
      price: "59.99 MAD / mois",
      description: "Idéal pour un usage régulier.",
    },
    {
      title: "Semestrielle",
      price: "199.99 MAD / trimestre",
      description: "Solution éco. pour un engagement long terme.",
    },
  ];

  const commonButtonStyle = {
    color: 'rgb(8, 151, 66)',
    borderColor: 'rgb(8, 151, 66)',
    '&:hover': {
      color: 'white',
      backgroundColor: 'rgb(8, 151, 66)',
    },
  };

  const SectionSeparator = () => (
    <Box
      sx={{
        height: '4px',
        width: '200px',
        background: 'linear-gradient(90deg,#008d36,#008d36)',
        margin: '40px auto 0 auto',
        borderRadius: '8px',
      }}
    ></Box>
  );

  return (
    <div style={{ marginTop: '64px' }}>
      <Box sx={{ padding: '50px', backgroundColor: 'white', minHeight: '100vh' }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', marginBottom: '40px' }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'rgb(8, 151, 66)' }}>
            À propos de nous
          </Typography>
          <Typography sx={{ marginTop: '10px', fontSize: '1.2rem', color: '#555' }}>
            Découvrez notre mission et les objectifs de notre plateforme.
          </Typography>
        </Box>

        {/* About Content Section */}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '300px',
                backgroundImage: 'url(/images/img1.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '10px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            ></Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
              Notre Vision
            </Typography>
            <Typography sx={{ marginBottom: '15px', fontSize: '1rem', lineHeight: '1.8', color: '#555' }}>
            Notre croyance c'est d'assurer une utilisation optimale et équitable des places de stationnement. 
            En intégrant les emplois du temps des étudiants et du personnel, il vise à réduire les conflits et
             à améliorer l'organisation. Le système favorise une gestion fluide et efficace en temps réel. 
             Il contribue ainsi à un environnement mieux structuré et fonctionnel sur le campus
            </Typography>
            {/* <Button
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
            </Button> */}
          </Grid>
        </Grid>

        <SectionSeparator />

        {/* Team Section */}
        <Box sx={{ marginTop: '50px', textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
            Notre Équipe
          </Typography>
          <Typography sx={{ marginBottom: '40px', fontSize: '1rem', color: '#555' }}>
            Rencontrez les personnes qui rendent tout cela possible.
          </Typography>

          <Grid container spacing={2}>
            {Object.keys(membres).map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member}>
                <Box
                  sx={{
                    height: '200px',
                    backgroundImage: `url(/images/${member.toLowerCase()}.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  }}
                ></Box>
                <Typography variant="h6" sx={{ marginTop: '15px', fontWeight: 'bold', color: '#333' }}>
                  {member}
                </Typography>
                <Typography sx={{ color: '#777', fontSize: '0.9rem' }}>{membres[member]}</Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        <SectionSeparator />

        {/* Payment Information Section */}
        <Box sx={{ marginTop: '30px', textAlign: 'center', padding: '40px' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
            Options de paiement
          </Typography>
          <Typography sx={{ marginBottom: '40px', fontSize: '1rem', color: '#555' }}>
            Choisissez la formule qui correspond le mieux à vos besoins pour un stationnement sans souci.
          </Typography>

          <Grid container spacing={4}>
            {paymentPlans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan.title}>
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
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 'bold', color: 'rgb(8, 151, 66)', marginBottom: '10px' }}
                  >
                    {plan.title}
                  </Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                    {plan.price}
                  </Typography>
                  <Typography sx={{ color: '#777', fontSize: '0.9rem', marginBottom: '20px' }}>
                    {plan.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/parking')}
                    sx={commonButtonStyle}
                  >
                    Choisir
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default AboutPage;
