import React, {useEffect, useState} from "react";
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
import EtudiantApi from "../Api/EtudiantApi";

const pages = [
  { name: "Acceuil", id: "acceuil", path: "/" },
  { name: "About", id: "about", path: "/about" },
  { name: "Reservation", id: "reservation", path: "/parking" },
  { name: "Contact", id: "contact", path: "/contact" },
];

const Header = () => {
  const [etudiant, setEtudiant] = useState({});
  const [loading, setLoading] = useState(true);
  // Récupérer les données utilisateur depuis localStorage
  
    
  // Vérifier si les données existent et si l'utilisateur est un admin
  
      
      
          // Extraire l'ID de l'administrateur
          
          // Utilisation de useEffect pour appeler fetchEtudiants une fois que le composant est monté
          useEffect(() => {
            const fetchEtudiantById = async () => {
              try {
                const etudiant = await EtudiantApi.fetchEtudiantById();
                setEtudiant(etudiant);
                console.log(etudiant);
                setLoading(false);
              } catch (error) {
                console.log("Impossible de récupérer les etudiants."+error);
                setLoading(false);
              }
            };
            fetchEtudiantById();
          }, []); // [] signifie que cela s'exécutera une seule fois au montage du composant

  return (
    (
      <div>
        <AppBar position="fixed" style={{ backgroundColor: "rgb(8, 151, 66)" }}>
        <span>
          {loading ? "Chargement..." : etudiant.nom} {/* Afficher "Chargement..." pendant le chargement */}
        </span>
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