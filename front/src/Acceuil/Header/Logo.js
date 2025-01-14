import React from "react";
import { Typography } from "@mui/material";

const Logo = ({ navigate }) => (
  <Typography
    variant="h6"
    sx={{
      cursor: "pointer",
      fontWeight: "bold",
      fontFamily: "'Poppins', sans-serif",
      flexGrow: { xs: 1, md: 0 }
    }}
    onClick={() => navigate("/")}
  >
  Parking EMSI
    {/* Parking EMSI */}
  </Typography>
);

export default Logo;