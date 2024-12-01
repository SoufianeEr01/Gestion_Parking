import React from "react";
import "./Acceuil.css"
import { Link as RouterLink } from 'react-router-dom';
import {
  Stack,
  Link,
  Toolbar,
  Typography,
  Container,
  AppBar,
  Box,
} from "@mui/material";
const pages = [
  { name: "Acceuil", id: "acceuil", path: "/" },
  { name: "About", id: "about", path: "/about" },
  { name: "Reservation", id: "reservation", path: "/parking" },
  { name: "Contact", id: "contact", path: "/contact" },
];
const Header = () => {
  return (
    (
      <div>
        <AppBar position="fixed" style={{ backgroundColor: "rgb(8, 151, 66)" }}>
          <Container>
            <Toolbar>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Typography variant="h6" style={{ cursor: "pointer"}}>
                  Parking EMSI
                </Typography>
                <Stack direction="row" gap={11}>
                  
                  {pages.map((page) => (
                    <RouterLink to={page.path} style={{
                      textDecoration: "none",
                    }}>
                     <Link
                     key={page.id}
                    // to={page.path} // Utiliser 'to' pour la navigation dans react-router-dom
                     sx={{
                       color: "white",
                       textDecoration: "none",
                       cursor: "pointer",
                       padding: '5px',
                       transition: 'all 0.3s ease',
                       "&:hover": {
                         borderRadius: '5px',
                         transform: 'scale(1.1)',
                       },
                     }}
                   >
                     {page.name}
                   </Link></RouterLink>
                  ))}
                </Stack>
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>
  
      </div>
    )
  );
};
export default Header;