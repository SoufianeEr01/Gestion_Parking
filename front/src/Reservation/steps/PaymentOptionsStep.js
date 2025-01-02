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
    <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
      Options de paiement
    </Typography>
    <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
      {paymentOptions.map((option, index) => (
        <Card
          key={index}
          sx={{
            minWidth: 275,
            border: selectedOption === index ? "2px solid #1976d2" : "1px solid #ccc",
            transition: "0.3s",
            cursor: "pointer",
          }}
          onClick={() => setSelectedOption(index)}
        >
          <CardContent>
            <Typography variant="h6" textAlign="center" color="primary">
              {option.title}
            </Typography>
            <Typography variant="body1" textAlign="center">
              {option.price}
            </Typography>
            <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
              {option.description}
            </Typography>
          </CardContent>
          {selectedOption === index && (
            <CardActions>
              <Typography textAlign="center" color="success.main" sx={{ width: "100%" }}>
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
