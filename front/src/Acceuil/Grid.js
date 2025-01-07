import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

function TwoRowGrid() {
  return (
    <div style={{ margin: '20px 50px', padding: '20px' }}>
      <Grid container spacing={4}>
        {/* Première ligne : Image à gauche, Texte à droite */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundImage: 'url(/images/img6.jpg)', // Chemin de l'image
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '20px',
              height: '300px',
              width: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} display="flex" alignItems="center">
          <Box sx={{ padding: '20px', backgroundColor: '#008d36', borderRadius: '20px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>
              Une gestion de parking simplifiée et accessible !
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', lineHeight: '1.8' }}>
              Notre solution vous permet de réserver votre place en quelques clics, de vérifier les disponibilités en temps réel et de bénéficier d'une interface moderne et intuitive, adaptée aux besoins de la vie universitaire.
            </Typography>
          </Box>
        </Grid>

        {/* Deuxième ligne : Texte à gauche, Image à droite */}
        <Grid item xs={12} md={6} display="flex" alignItems="center">
          <Box sx={{ padding: '20px', backgroundColor: '#008d36', borderRadius: '20px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>
              Optimisez votre stationnement sur le campus !
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', lineHeight: '1.8' }}>
              Grâce à une gestion intelligente des places et à des outils de suivi, notre plateforme assure un accès facilité et contribue à réduire les embouteillages. Priorisez votre temps, et déplacez-vous en toute tranquillité.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundImage: 'url(/images/img5.jpeg)', // Chemin de la deuxième image
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '20px',
              height: '300px',
              width: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default TwoRowGrid;
