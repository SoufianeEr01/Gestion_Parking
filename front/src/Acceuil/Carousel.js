import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Button, Typography } from '@mui/material';

function ImageCarousel() {
  const images = [
    '/images/pixel.jpg',
    '/images/pixel2.jpg',
    '/images/pixels3.jpg', // Replace with the names of your images in the public folder
  ];

  return (
    <Carousel
      indicators={true}           // Show pagination indicators
      navButtonsAlwaysVisible={true} // Always show navigation buttons (arrows)
      autoPlay={true}             // Enable automatic scrolling
      interval={3000}             // Set duration for each image (in ms)
      animation="fade"           // Smooth "fade" animation for transitions
    >
      {images.map((src, index) => (
        <Box
          key={index}
          sx={{
            position: 'relative',
            height: '450px',               // Adjust height as needed
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',       // Align content at the bottom
            justifyContent: 'center',
            boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.7)', // Dark overlay effect
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent overlay for text
              color: 'white',
              padding: '20px',
              textAlign: 'center',
              borderRadius: '10px',
              marginBottom: '30px',
              
            }}
            
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Découvrez nos services
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 2 }}>
              Réservez votre place dès maintenant pour profiter d'un service exceptionnel !
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'rgb(8, 151, 66)',
                '&:hover': {
                  backgroundColor: 'rgb(6, 120, 52)',
                  transform: 'scale(1.1)',
                },
                color: 'white',
                padding: '10px 20px',
                fontSize: '18px',
                borderRadius: '5px',
                transition: 'all 0.3s ease',
              }}
            >
              Réserver
            </Button>
          </Box>
        </Box>
      ))}
    </Carousel>
  );
}

export default ImageCarousel;
