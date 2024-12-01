import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Button, Typography } from '@mui/material';
import { Margin } from '@mui/icons-material';

function ImageCarousel() {
  const images = [
    '/images/img3.jpg',
    '/images/img2.jpeg',
    '/images/img5.jpeg', // Remplace par le nom de tes images dans le dossier public
  ];

  return (
    <Carousel
      indicators={true}           // Montre les indicateurs de pagination
      navButtonsAlwaysVisible={true} // Affiche toujours les boutons de navigation (flèches)
      autoPlay={true}             // Active le défilement automatique
      interval={3000}             // Définit la durée de chaque image (en ms)
      animation="slide"           // Animation de type "slide" (ou "fade")
    >
      {images.map((src, index) => (
        <Box
          key={index}
          sx={{
            position: 'relative',
            height: '400px',               // Ajuste la hauteur selon tes préférences
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'rgb(8, 151, 66)',      // Couleur bleue par défaut
              '&:hover': {
                transform: 'scale(1.1)',
              },
              color: 'white',
              padding: '10px 20px',
              fontSize: '18px',
              marginTop: '250px',
              borderRadius: '5px',
              transition: 'all 0.3s ease',
            }}
          >
            Reserver
          </Button>
        </Box>
      ))}
    </Carousel>
  );
}

export default ImageCarousel;
