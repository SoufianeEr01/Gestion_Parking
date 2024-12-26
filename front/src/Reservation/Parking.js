import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useSwipeable } from 'react-swipeable';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PlaceParkingApi from '../Api/PlaceParkingApi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import Emploi from './Emploi';

const Parking = () => {
  const [reserved, setReserved] = useState([]); // Reserved places
  const [availablePlaces, setAvailablePlaces] = useState([]); // Available places
  const [currentFloor, setCurrentFloor] = useState(1); // Current floor
  const totalFloors = 4; // Total floors
  const placesPerFloor = 20; // Places per floor

  const [dialogOpen, setDialogOpen] = useState(false); // Dialog open state
  const [selectedPlace, setSelectedPlace] = useState(null); // Selected place

  // Fetch parking places data from API
  useEffect(() => {
    const fetchAvailablePlaces = async () => {
      try {
        const allPlaces = await PlaceParkingApi.fetchPlaceParkings();
        setAvailablePlaces(allPlaces);
      } catch (error) {
        console.error('Error fetching available parking places:', error);
      }
    };
    fetchAvailablePlaces();
  }, []);

  // Handle reservation
  const handleReservation = (placeNumber) => {
    setSelectedPlace(placeNumber);
    setDialogOpen(true); // Open the dialog
  };

  // Handle floor change (next/previous)
  const handleFloorChange = (direction) => {
    setCurrentFloor((prev) =>
      direction === 'next'
        ? Math.min(prev + 1, totalFloors)
        : Math.max(prev - 1, 1)
    );
  };

  // Handle swipe gestures for floor navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleFloorChange('next'),
    onSwipedRight: () => handleFloorChange('prev'),
    trackMouse: true,
  });

  // Get places on the current floor
  const currentFloorPlaces = availablePlaces.filter(
    (place) =>
      place.id > (currentFloor - 1) * placesPerFloor &&
      place.id <= currentFloor * placesPerFloor
  );

  const isCurrentFloorEmpty = currentFloorPlaces.length === 0;

  // Generate the parking grid
  const renderParking = () => {
    const rows = [];
    const startPlace = (currentFloor - 1) * placesPerFloor + 1;
    const endPlace = currentFloor * placesPerFloor;
    const neutralColor = 'WHite';
    const reservedColor = 'red';

    for (let row = 0; row < 2; row++) {
      const places = [];
      for (let col = 1; col <= 10; col++) {
        const placeNumber = startPlace + row * 10 + col - 1;
        const isAvailable = currentFloorPlaces.some(
          (place) => place.id === placeNumber
        );

        if (isAvailable) {
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
            border: '2px solid ',
            transition: 'all 0.3s ease-in-out',
            transform: 'skew(+10deg)',
            ':hover': {
              transform: 'skew(+10deg) scale(1.05)',
            },
          };

          places.push(
            <Box
              key={placeNumber}
              onClick={() => handleReservation(placeNumber)}
              sx={boxStyles}
            >
              <LocalParkingIcon /> {placeNumber}
            </Box>
          );
        }
      }

      rows.push(
        <Box key={row} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {places}
        </Box>
      );

      if (row === 0) {
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
      {...swipeHandlers}
      sx={{
        padding: 4,
        backgroundColor: 'white',
        minHeight: '100vh',
        marginTop: 5,
        overflow: 'hidden',
      }}
    >
      {!isCurrentFloorEmpty && (
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
              height: 40,
              width: 40,
              minWidth: 40,
            }}
          >
            <ArrowBackIosIcon />
          </Button>

          <Box
            sx={{
              maxWidth: 1150,
              margin: '0 auto',
              padding: 3,
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
            }}
          >
            <ArrowForwardIosIcon />
          </Button>
        </Box>
      )}

      {isCurrentFloorEmpty && (
        <Box sx={{ padding: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#555' }}>
            Aucun parking disponible à l'étage {currentFloor}.
          </Typography>
        </Box>
      )}

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

      {/* Dialog for place reservation */}
      <Emploi
        open={dialogOpen}
        place={selectedPlace}
        onClose={() => setDialogOpen(false)} // Close the dialog
        onReserve={(placeNumber) => {
          setReserved((prev) => [...prev, placeNumber]);
          setDialogOpen(false); // Close after reserving
        }}
      />
    </Box>
  );
};

export default Parking;
