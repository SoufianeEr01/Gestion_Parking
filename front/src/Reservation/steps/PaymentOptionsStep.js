import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActions,
} from "@mui/material";

const PaymentOptionsStep = ({ paymentOptions, selectedOption, setSelectedOption }) => (
  <Box>
  <Typography
    variant="h6"
    textAlign="center"
    sx={{
      mb: 2,
      color: "#008D36", // Titre en vert
      fontWeight: "bold",
    }}
  >
    Options de paiement
  </Typography>
  <Box
    display="flex"
    justifyContent="center"
    flexWrap="wrap"
    gap={2}
  >
    {paymentOptions.map((option, index) => (
      <Card
        key={index}
        sx={{
          minWidth: 275,
          border: selectedOption === index ? "2px solid #008D36" : "1px solid #ccc", // Bordure verte si sélectionné
          boxShadow: selectedOption === index
            ? "0 4px 10px rgba(0, 141, 54, 0.2)" // Ombre douce verte si sélectionné
            : "0 2px 5px rgba(0, 0, 0, 0.1)", // Ombre discrète par défaut
          backgroundColor: selectedOption === index ? "#F8F8F8" : "#FFF", // Fond blanc cassé si sélectionné
          transition: "0.3s",
          cursor: "pointer",
          "&:hover": {
            borderColor: "#006B28", // Bordure vert foncé au survol
            backgroundColor: "#F0F0F0", // Fond gris clair au survol
            boxShadow: "0 4px 10px rgba(0, 141, 54, 0.2)", // Accentuation de l'ombre au survol
          },
        }}
        onClick={() => setSelectedOption(index)}
      >
        <CardContent>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              color: selectedOption === index ? "#008D36" : "#444", // Titre vert si sélectionné, gris foncé sinon
              fontWeight: "bold",
            }}
          >
            {option.title}
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{
              color: "#555", // Texte en gris moyen pour les prix
            }}
          >
            {option.price}
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{
              mt: 1,
              color: "#777", // Texte en gris clair pour la description
            }}
          >
            {option.description}
          </Typography>
        </CardContent>
        {selectedOption === index && (
          <CardActions>
            <Typography
              textAlign="center"
              color="success.main" // Texte vert pour "Sélectionné"
              sx={{
                width: "100%",
                fontWeight: "bold",
              }}
            >
              Sélectionné
            </Typography>
          </CardActions>
        )}
      </Card>
    ))}
  </Box>
</Box>


);

export default PaymentOptionsStep;
