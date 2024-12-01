import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useSwipeable } from 'react-swipeable'; // Gestion des glissements
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
const Parking = () => {
  const [reserved, setReserved] = useState([]);
  const [currentFloor, setCurrentFloor] = useState(1); // Gestion de l'étage courant
  const totalFloors = 4; // Nombre total d'étages
  const placesPerFloor = 20;

  // Gérer la réservation ou l'annulation d'une place
  const handleReservation = (placeNumber) => {
    setReserved((prev) =>
      prev.includes(placeNumber)
        ? prev.filter((p) => p !== placeNumber)
        : [...prev, placeNumber]
    );
  };

  // Changer d'étage
  const handleFloorChange = (direction) => {
    setCurrentFloor((prev) =>
      direction === 'next'
        ? Math.min(prev + 1, totalFloors)
        : Math.max(prev - 1, 1)
    );
  };

  // Gérer le glissement
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleFloorChange('next'), // Glissement vers la gauche -> étage suivant
    onSwipedRight: () => handleFloorChange('prev'), // Glissement vers la droite -> étage précédent
    trackMouse: true, // Permet de détecter aussi les glissements avec la souris
  });

  // Générer les places de parking pour l'étage courant
  const renderParking = () => {
    const rows = [];
    const startPlace = (currentFloor - 1) * placesPerFloor + 1;
    const endPlace = currentFloor * placesPerFloor;
    const neutralColor = '#089742';
    const reservedColor = 'red';

    for (let row = 1; row <= 2; row++) {
      const places = [];
      for (let col = 1; col <= 10; col++) {
        const placeNumber = startPlace + (row - 1) * 10 + col - 1;

        const boxStyles = {
          width: 120,
          height: 220,
          backgroundColor: reserved.includes(placeNumber)
            ? reservedColor
            : neutralColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: reserved.includes(placeNumber) ? '#FFF' : '#333',
          fontWeight: 'bold',
          fontSize: '24px',
          cursor: 'pointer',
          borderRadius: '8px',
          border: '2px solid #CCC',
          transition: 'all 0.3s ease-in-out',
          transform: 'skew(-10deg)', // Inclinaison pour effet italique
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          ':hover': {
            backgroundColor: '#005f32',
            transform: 'skew(-10deg) scale(1.05)',
          },
        };

        if (placeNumber <= endPlace) {
          places.push(
            <Box
              key={placeNumber}
              onClick={() => handleReservation(placeNumber)}
              sx={boxStyles}
            >
              {placeNumber}
            </Box>
          );
        }
      }

      rows.push(
        <Box key={row} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {places}
        </Box>
      );

      if (row === 1) {
        rows.push(
          <Box
            key="middle-line"
            sx={{
              width: '95%',
              height: 15,
              backgroundColor: '#D3D3D3',
              borderRadius: '8px',
              marginY: 3,
              backgroundImage:
                'repeating-linear-gradient(90deg, #777 0px, #777 20px, #fff 20px, #fff 40px)',
            }}
          />
        );
      }
    }

    return rows;
  };

  return (
    <Box
      {...swipeHandlers} // Appliquer les gestionnaires de glissement au conteneur principal
      sx={{
        padding: 4,
        backgroundColor: '#F7F7F7',
        minHeight: '100vh',
        marginTop: 5,
        overflow: 'hidden', // Empêche le défilement non voulu
      }}
    >
       <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '100%',
        }}
      >
      <Button
          variant="contained"
          onClick={() => handleFloorChange('prev')}
          disabled={currentFloor === 1}
          sx={{
            color: 'white',
            backgroundColor: currentFloor === 1 ? 'grey' : '#089742',
            height: 40,
            width: 40,
            minWidth: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            
          }}
        >
          <ArrowBackIosIcon />
        </Button>


      <Box
        sx={{
          maxWidth: 1150,
          margin: '0 auto',
          padding: 3,
          borderRadius: 4,
          backgroundColor: '#FFF',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
       
        {renderParking()}
        
      </Box>
      <Button
          variant="contained"
          onClick={() => handleFloorChange('next')}
          disabled={currentFloor === totalFloors}
          sx={{
            color: 'white',
            backgroundColor: currentFloor === totalFloors ? 'grey' : '#089742',
            height: 40,
            width: 40,
            minWidth: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ArrowForwardIosIcon />
        </Button>
        </Box>
        <Box sx={{ marginTop: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Étage {currentFloor} / {totalFloors}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            marginTop: 2,
            fontWeight: 'bold',
            color: '#555',
          }}
        >
          Places Réservées : {reserved.join(', ') || 'Aucune'}
        </Typography>
      </Box>
    </Box>
      
  );
};

export default Parking;
