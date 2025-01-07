import React from 'react';
import { Typography, Container, Grid, Box, Paper } from '@mui/material';
import { LocalParking, Security, TimeToLeave, Money } from '@mui/icons-material';

const services = [
  {
    icon: <LocalParking fontSize="large" />,
    title: "Gestion des places",
    description: "Réservez et gérez vos places de parking en un clic.",
  },
  {
    icon: <Security fontSize="large" />,
    title: "Sécurité garantie",
    description: "Vos véhicules sont surveillés avec notre système sécurisé.",
  },
  {
    icon: <TimeToLeave fontSize="large" />,
    title: "Gain de temps",
    description: "Réduisez le temps passé à chercher une place.",
  },
  {
    icon: <Money fontSize="large" />,
    title: "Coût abordable",
    description: "Des solutions économiques adaptées à tous.",
  },
];

function ServicesSection() {
  return (
    <Box sx={{ py: 8 }}>
      <Container>
        {/* Titre principal */}
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#008d36" }}
        >
          Nos Services
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ color: "text.secondary", maxWidth: 600, mx: "auto" }}
          gutterBottom
        >
          Découvrez comment notre application révolutionne la gestion de votre
          stationnement avec des solutions modernes et accessibles.
        </Typography>

        {/* Grille des services */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  textAlign: "center",
                  backgroundColor: "#ffffff",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                {/* Icône */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#007B55",
                    mb: 2,
                  }}
                >
                  {service.icon}
                </Box>

                {/* Titre du service */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#333333", fontWeight: "bold" }}
                >
                  {service.title}
                </Typography>

                {/* Description du service */}
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {service.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default ServicesSection;
