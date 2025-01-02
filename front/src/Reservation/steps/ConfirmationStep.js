import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ConfirmationStep = () => (
  <Box textAlign="center" mt={3}>
    <Typography variant="h6">Votre réservation est confirmée!</Typography>
    <CheckCircleIcon fontSize="large" sx={{ color: "green", mt: 2 }} />
  </Box>
);

export default ConfirmationStep;
