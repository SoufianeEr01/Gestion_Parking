import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { Users, Car } from "lucide-react";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonneApi from "../../Api/PersonneApi";
import PlaceParkingApi from "../../Api/PlaceParkingApi";
import ReservationApi from "../../Api/ReservationApi";
import PersonnelApi from "../../Api/PersonnelApi";

function TableauDeBord() {
  const [data, setData] = useState({
    userCount: "Chargement...",
    enseignantCount: "Chargement...",
    administrateurCount: "Chargement...",
    parkingCount: "Chargement...",
    reservCount: "Chargement...",
    error: null,
  });

  const fetchData = async () => {
    try {
      const [userCount, personnels, parkingCount, reservations] = await Promise.all([
        PersonneApi.fetchPersonnesCount(), // Récupère le nombre total d'utilisateurs
        PersonnelApi.fetchPersonnels(),    // Récupère les détails des utilisateurs
        PlaceParkingApi.fetchPlaceParkingsCount(),
        ReservationApi.fetchReservations(),
      ]);
  
      // Comparer les rôles
      const enseignantCount = personnels.filter((p) => p.role === "Enseignant").length;
      const administrateurCount = personnels.filter((p) => p.role === "administrateur").length;
  
      // Calculate the student count
      const studentCount = userCount - (enseignantCount + administrateurCount);
  
      setData({
        userCount,
        enseignantCount,
        administrateurCount,
        studentCount,  // Add the student count here
        parkingCount,
        reservCount: reservations.length,
        error: null,
      });
    } catch (err) {
      console.error("Erreur lors de la récupération des données :", err);
      setData((prevState) => ({
        ...prevState,
        error: "Erreur lors du chargement des données.",
      }));
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      label: "Utilisateurs Total",
      value: data.error || data.userCount - 1,
      icon: <Users />,
      color: "#2196F3",
    },
    {
      label: "Étudiants",  // New entry for students
      value: data.error || data.studentCount - 1,
      icon: <Users />,
      color: "#3F51B5",  // You can change the color
    },
    {
      label: "Enseignants",
      value: data.error || data.enseignantCount,
      icon: <Users />,
      color: "#4CAF50",
    },
    {
      label: "Administrateurs",
      value: data.error || data.administrateurCount,
      icon: <Users />,
      color: "#FFC107",
    },
    {
      label: "Places de Parking",
      value: data.error || data.parkingCount,
      icon: <Car />,
      color: "#FF5722",
    },
    {
      label: "Nombre de Réservations",
      value: data.error || data.reservCount,
      icon: <EventAvailableIcon />,
      color: "#9C27B0",
    },
  ];
  

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }}
      gap={4}
      mb={4}
    >
      {stats.map((stat) => (
        <Card key={stat.label} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>{stat.icon}</Avatar>
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {stat.value}
            </Typography>
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
