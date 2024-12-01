import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

function TwoRowGrid() {
  return (
    <div style={{margin: '20px 50px 20px 50px', backgroundColor: 'white',}}>
        <Grid container spacing={2}>
      {/* Première ligne : Image à gauche, Texte à droite */}
      <Grid item xs={12} md={6}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Box
            sx={{
                backgroundImage: 'url(/images/img6.jpg)', // Chemin de l'image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '40px',
                height: '300px',
                width: '700px',

            }}
            />
        </div>
      </Grid>
      <Grid item xs={12} md={6} display="flex" alignItems="center">
        <Typography variant="h6" sx={{ padding: '20px', backgroundColor: 'rgb(34, 182, 96)', borderRadius: '50px', fontSize: '1.25rem', lineHeight: '1.6'  }}>
        <h2><span style={{color: 'white'}}>Une gestion de parking simplifiée et accessible !</span></h2> Notre solution vous permet de réserver votre place en quelques clics, de vérifier les disponibilités en temps réel et de bénéficier d'une interface moderne et intuitive, adaptée aux besoins de la vie universitaire.
        </Typography>
      </Grid>

      {/* Deuxième ligne : Texte à gauche, Image à droite */}
      <Grid item xs={12} md={6} display="flex" alignItems="center">
        <Typography variant="h6" sx={{ padding: '20px', backgroundColor: 'rgb(34, 182, 96)', borderRadius: '50px', fontSize: '1.25rem', lineHeight: '1.6' }}>
        <h2><span style={{color: 'white'}}>Optimisez votre stationnement sur le campus !</span></h2> Grâce à une gestion intelligente des places et à des outils de suivi, notre plateforme assure un accès facilité et contribue à réduire les embouteillages. Priorisez votre temps, et déplacez-vous en toute tranquillité.        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Box
          sx={{
            backgroundImage: 'url(/images/img5.jpeg)', // Chemin de la deuxième image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '300px',
            borderRadius: '40px',
            width: '700px',
          }}
        />
        </div>
      </Grid>
    </Grid>
    </div>
    
  );
}

export default TwoRowGrid;
