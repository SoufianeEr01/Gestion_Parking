import React, { useState, useEffect } from 'react';
import PlaceParkingApi from '../Api/PlaceParkingApi';
import './Parking.css';
import PlaceReservationDialog from './PlaceReservationDialog';
import { Tooltip } from 'react-tooltip';  // Assurez-vous de l'importation correcte

function Parking() {
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [spots, setSpots] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [reserved, setReserved] = useState([]);


  
  // Fetch parking places data from API
  useEffect(() => {
    const fetchAvailablePlaces = async () => {
      try {
        const allPlaces = await PlaceParkingApi.fetchPlaceParkings();
        
      // console.log(allPlaces);
        const formattedSpots = [
          {
            id: 0,
            name: 'Rez-de-chaussée',
            spots: allPlaces
              .filter((place) => place.etage === 0)
              .map((place) => ({
                id: place.id,
                number: place.numero,
                status: place.etat === 'libre' ? 'Libre' : 'Occupé',
                reservationEnd: place.dateFinReservation,
              })),
          },
          {
            id: 1,
            name: '1er étage',
            spots: allPlaces
              .filter((place) => place.etage === 1)
              .map((place) => ({
                id: place.id,
                number: place.numero,
                status: place.etat === 'libre' ? 'Libre' : 'Occupé',
                reservationEnd: place.dateFinReservation,
              })),
          },
          {
            id: 2,
            name: '2ème étage',
            spots: allPlaces
              .filter((place) => place.etage === 2)
              .map((place) => ({
                id: place.id,
                number: place.numero,
                status: place.etat === 'libre' ? 'Libre' : 'Occupé',
                reservationEnd: place.dateFinReservation,
              })),
          },
        ];
        setSpots(formattedSpots);
      } catch (error) {
        console.error('Error fetching parking places:', error);
      }
    };
    fetchAvailablePlaces();
  }, [spots]);
  

  const handleReservation = (placeId) => {
    setSelectedPlace(placeId);
    setDialogOpen(true); // Open the dialog
  };

  return (
    <div className="parking-container">
      <div className="floor-selector">
        {spots.map((floor) => (
          <button
            key={floor.id}
            className={`floor-button ${selectedFloor === floor.id ? 'active' : ''}`}
            onClick={() => setSelectedFloor(floor.id)}
          >
            {floor.name}
          </button>
        ))}
      </div>

      {spots[selectedFloor] && (
        <div className="parking-floor">
          <h2>{spots[selectedFloor].name}</h2>
          <div className="parking-grid" >
            {spots[selectedFloor].spots.map((spot) => (
              <div
                key={spot.id}
                className={`spot ${spot.status === 'Occupé' ? 'occupe' : 'libre'}`}
                onClick={spot.status === 'Occupé' ? null : () => handleReservation(spot.id)}
                style={{ cursor: spot.status === 'Occupé' ? 'not-allowed' : 'pointer' }}
                data-tooltip-id={`tooltip-${spot.id}`}  // Identifiant unique pour chaque tooltip
              >
                <span className="spot-number">{spot.number}</span>
                <span className="spot-status">{spot.status}</span>

                {/* Tooltip pour afficher la date de fin de réservation
                {spot.status === 'Occupé' && (
                  <Tooltip id={`tooltip-${spot.id}`} place="top" effect="solid">
                    Réservée jusqu'au {spot.reservationEnd}
                  </Tooltip>
                )} */}
              </div>
            ))}
          </div>

          <div className="legend">
            <div className="legend-item">
              <div className="legend-color libre"></div>
              <span>Disponible</span>
            </div>
            <div className="legend-item">
              <div className="legend-color occupe"></div>
              <span>Occupé</span>
            </div>
          </div>
        </div>
      )}

      <PlaceReservationDialog
        open={dialogOpen}
        place={selectedPlace}
        onClose={() => setDialogOpen(false)}
        onReserve={(placeId) => {
          setReserved((prev) => [...prev, placeId]);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}

export default Parking;
