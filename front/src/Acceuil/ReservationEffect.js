import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, IconButton, Box } from '@mui/material';
import { User, MapPin, Calendar, Clock, CreditCard } from 'lucide-react';
import ReservationApi from '../Api/ReservationApi';
import EtudiantApi from '../Api/EtudiantApi'; // Ajouter si nécessaire
import PersonnelApi from '../Api/PersonnelApi'; // Ajouter si nécessaire
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

const ReservationEffect = ({ personne }) => {
  const [reservations, setReservations] = useState([]);
  const [userData, setUserData] = useState({
    id: 0,
    nom: "",
    prenom: "",
    email: "",
    discriminator: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstDate, setFirstDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);

  const fetchReservations = async () => {
    try {
      const data = await ReservationApi.fetchReservationById_personne(userData.id);
      if (data && data.length > 0) {
        // Trier par date (ordre croissant)
        const sortedReservations = [...data].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setReservations(sortedReservations);
        setFirstDate(sortedReservations[0].date); // Première date
        setLastDate(sortedReservations[sortedReservations.length - 1].date); // Dernière date
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [userData.id]);
  useEffect(() => {
    const fetchUser = async () => {
      if (!personne.id || !personne.discriminator) {
        setError("Utilisateur non valide.");
        setLoading(false);
        return;
      }

      try {
        let data;
        if (personne.discriminator === "Etudiant") {
          data = await EtudiantApi.fetchEtudiantById(personne.id);
        } else if (personne.discriminator === "Personnel") {
          data = await PersonnelApi.fetchPersonnelById(personne.id);
        } else {
          throw new Error("Rôle utilisateur inconnu.");
        }

        setUserData({ ...data, discriminator: personne.discriminator });
      } catch (error) {
        setError("Erreur lors de la récupération des données.");
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [personne]);


  const calculateRemainingTime = (endDate) => {
    const now = new Date(firstDate); // Utilise la première date (firstDate) comme point de départ
    const end = new Date(endDate);
    const diff = end - now;
  
    if (diff <= 0) {
      return "Temps écoulé";
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} jours, ${hours} heures`;
  };
  

  if (loading) {
    return <Typography>Chargement...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  const reservation = reservations[0];
  const remainingTime = lastDate ? calculateRemainingTime(lastDate) : "Non disponible";


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, backgroundColor: '#white' }}>
      <Card sx={{ maxWidth: 800, width: '100%' }}>
        <CardContent sx={{ backgroundColor: '#008d36', color: 'white', paddingBottom: 2 }}>
          <Typography variant="h5" gutterBottom>
            Réservation de Parking
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Détails de la réservation N° {reservations[0]?.id}
          </Typography>
        </CardContent>

        <CardContent>
          <Grid container spacing={3}>
            {/* Infos utilisateur */}
            <Grid item xs={12} md={12}>
              <Box display="flex" alignItems="center" sx={{ padding: 2, backgroundColor: '#e0f2fe', borderRadius: 2 }}>
                <IconButton sx={{ backgroundColor: 'white', borderRadius: '50%', padding: 2 ,color: 'black'}}>
                  <User size={24} className="text-blue-600" />
                </IconButton>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    {personne.discriminator === "Personnel" ? "Personnel" : "Étudiant"}
                  </Typography>
                  <Typography variant="h6">{`${userData.nom} ${userData.prenom}`}</Typography>
                  {personne.discriminator === "Etudiant" && (
                    <Typography variant="body2">Matricule : {userData.id}</Typography>
                  )}
                  {personne.discriminator === "Personnel" && (
                    <Typography variant="body2">Role : {userData.role}</Typography>
                  )}
                </Box>
              </Box>
            </Grid>

          </Grid>

          {/* Infos supplémentaires */}
          <Grid container spacing={3} sx={{ marginTop: 2 }}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" sx={{ padding: 2, backgroundColor: '#e0f2fe', borderRadius: 2 }}>
                <IconButton sx={{ backgroundColor: 'white', borderRadius: '50%', padding: 2,color: 'black' }}>
                  <Calendar size={24} className="text-blue-600" />
                </IconButton>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Date De début
                  </Typography>
                  <Typography variant="h6">{firstDate || "Non disponible"}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" sx={{ padding: 2, backgroundColor: '#e0f2fe', borderRadius: 2 }}>
                <IconButton sx={{ backgroundColor: 'white', borderRadius: '50%', padding: 2 ,color: 'black'}}>
                  <Calendar size={24} className="text-blue-600" />
                </IconButton>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Date De fin
                  </Typography>
                  <Typography variant="h6">{lastDate || "Non disponible"}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ marginTop: 2 }}>
          <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" sx={{ padding: 2, backgroundColor: '#e0f2fe', borderRadius: 2 }}>
          <IconButton sx={{ backgroundColor: 'white', borderRadius: '50%', padding: 2,color: 'black' }}>
          <HourglassBottomIcon sx={{ fontSize: 24, color: 'black' }} />
          </IconButton>
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Temps Restant
              </Typography>
              <Typography variant="h6">{ remainingTime || "Aucune"} </Typography>
            </Box>
          </Box>
        </Grid>
          <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" sx={{ padding: 2, backgroundColor: '#e0f2fe', borderRadius: 2 }}>
                <IconButton sx={{ backgroundColor: 'white', borderRadius: '50%', padding: 2,color: 'black' }}>
                  <MapPin size={24} className="text-blue-600" />
                </IconButton>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Place de Parking
                  </Typography>
                  <Typography variant="h6"> Place {reservations[0]?.placeParking_id || "Non assigné"}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <hr></hr>
        <CardContent sx={{ textAlign: 'center'                                                  }}>
          <Typography variant="body2"  color='#6b7280' font-size=' 0.875rem' margin='0'>
          Cette réservation est valide uniquement pour les date indiqués.          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReservationEffect;

