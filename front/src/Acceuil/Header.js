import React, { useEffect, useState } from "react";
import "./Acceuil.css";
import { Link as RouterLink } from "react-router-dom";
import {
  Stack,
  Toolbar,
  Typography,
  Container,
  AppBar,
  Box,
} from "@mui/material";
import EtudiantApi from "../Api/EtudiantApi";

const pages = [
  { name: "Accueil", id: "acceuil", path: "/" },
  { name: "À propos", id: "about", path: "/about" },
  { name: "Réservation", id: "reservation", path: "/parking" },
  { name: "Contact", id: "contact", path: "/contact" },
];

const Header = () => {
  const [etudiant, setEtudiant] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEtudiantById = async () => {
      try {
        const etudiant = await EtudiantApi.fetchEtudiantById();
        setEtudiant(etudiant);
        //console.log(etudiant);
        setLoading(false);
      } catch (error) {
        console.log("Impossible de récupérer les étudiants." + error);
        setLoading(false);
      }
    };
    fetchEtudiantById();
  }, []);

  return (
    <AppBar position="fixed" style={{ backgroundColor: "rgb(0, 141, 54)" }}>
      <Container>
        <Toolbar>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            {/* Logo ou Titre */}
            <Typography
              variant="h6"
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Parking EMSI
            </Typography>

            {/* Navigation */}
            <Stack direction="row" gap={4}>
              {pages.map((page) => (
                <RouterLink
                  key={page.id}
                  to={page.path}
                  style={{ textDecoration: "none" }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      fontWeight: "500",
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
                        bottom: "0",
                        left: "0",
                        width: "0",
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
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
