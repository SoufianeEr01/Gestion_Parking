import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import { navigationLinks } from "./headerUtils";

const DesktopNav = () => (
  <Stack direction="row" spacing={4}>
    {navigationLinks.map((page) => (
      <RouterLink key={page.id} to={page.path} style={{ textDecoration: "none" }}>
        <Typography
          sx={{
            color: "white",
            fontSize: "1rem",
            textTransform: "uppercase",
            fontWeight: 600,
            position: "relative",
            padding: "5px 10px",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "#ffde59",
              transform: "scale(1.1)",
            },
            "&::after": {
              content: "''",
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 0,
              height: "2px",
              backgroundColor: "#ffde59",
              transition: "width 0.3s",
            },
            "&:hover::after": {
              width: "100%",
            },
          }}
        >
          {page.name}
        </Typography>
      </RouterLink>
    ))}
  </Stack>
);

export default DesktopNav;