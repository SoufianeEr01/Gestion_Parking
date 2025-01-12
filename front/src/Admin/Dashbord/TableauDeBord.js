import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { Users, ShoppingCart, CreditCard, TrendingUp, Car } from "lucide-react";
import PersonneApi from "../../Api/PersonneApi";
import PlaceParkingApi from "../../Api/PlaceParkingApi";
import ReservationApi from "../../Api/ReservationApi";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

function TableauDeBord() {
  const [userCount, setUserCount] = useState("Chargement...");
  const [parkingCount, setParkingCount] = useState("Chargement...");
  const [reservCount, setReservCount] = useState("Chargement...");

  const [error, setError] = useState(null);

  const fetchUserCount = async () => {
    try {
      const count = await PersonneApi.fetchPersonnesCount(); 
      setUserCount(count); 
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs.");
      console.error(err);
    }
  };

  const fetchtReservCount = async () => {
    try {
      const count = await ReservationApi.fetchReservations(); 
      setReservCount(count.length);  // Correctement orthographié 'length'
    } catch (err) {
      setError("Erreur lors du chargement des réservations.");
      console.error(err);
    }
  };
  
  const fetchParkingCount = async () => {

    try {
        const count = await PlaceParkingApi.fetchPlaceParkingsCount(); 
        setParkingCount(count); 
      } catch (err) {
        setError("Erreur lors du chargement des places de parking.");
        console.error(err);
      }
  };


  useEffect(() => {
    fetchUserCount();
    fetchParkingCount();
    fetchtReservCount();
  }, []);

  const stats = [
    {
      label: "Utilisateurs Total",
      value: error || userCount, 
      change: error ? "Erreur" : "+12.5%",
      icon: <Users />,
      color: "#2196F3",
    },
    {
      label: "Places de Parking",
      value: error || parkingCount, 
      change: error ? "Erreur" : "+8.2%",
      icon: <Car />, 
      color: "#FF5722", 
    },
   
    {
      label: "Nombre de réservations",
      value: error || reservCount,
      change: "+23.1%",
      icon: <EventAvailableIcon />,
      color: "#9C27B0", 
    },
    {
      label: "Croissance",
      value: "15.3%",
      change: "+4.5%",
      icon: <TrendingUp />,
      color: "#FF9800", // Orange
    },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" }}
      gap={4}
      mb={4}
    >
      {stats.map((stat) => (
        <Card key={stat.label} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              {/* Icône avec couleur */}
              <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>
                {stat.icon}
              </Avatar>
              {/* Changement en pourcentage */}
              <Typography variant="body2" sx={{ color: stat.color, fontWeight: "bold" }}>
                {stat.change}
              </Typography>
            </Box>
            {/* Valeur principale */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {stat.value}
            </Typography>
            {/* Description */}
            <Typography variant="body2" color="textSecondary">
              {stat.label}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default TableauDeBord;
