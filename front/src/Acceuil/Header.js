// import React, { useEffect, useState } from "react";
// import "./Acceuil.css";
// import { useNavigate, Link as RouterLink } from "react-router-dom";
// import {
//   Stack,
//   Toolbar,
//   Typography,
//   Container,
//   AppBar,
//   Box,
//   Avatar,
//   Menu,
//   MenuItem,
//   Dialog,
//   IconButton,
// } from "@mui/material";
// import { Logout, AccountCircle } from "@mui/icons-material";
// import EtudiantApi from "../Api/EtudiantApi";
// import PersonnelApi from "../Api/PersonnelApi";
// import ProfilePageUti from "./ProfilUti";

// const pages = [
//   { name: "Accueil", id: "acceuil", path: "/" },
//   { name: "À propos", id: "about", path: "/about" },
//   { name: "Réservation", id: "reservation", path: "/parking" },
//   { name: "Contact", id: "contact", path: "/contact" },
// ];

// const Header = () => {
//   const [etudiant, setEtudiant] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const navigate = useNavigate();

//   const userSessionData = JSON.parse(sessionStorage.getItem("userData"));
//   const userId = userSessionData?.id;
//   const discriminator = userSessionData?.discriminator;

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!userId || !discriminator) {
//         setLoading(false);
//         return;
//       }

//       try {
//         let data;
//         if (discriminator === "Etudiant") {
//           data = await EtudiantApi.fetchEtudiantById(userId);
//         } else if (discriminator === "Personnel") {
//           data = await PersonnelApi.fetchPersonnelById(userId);
//         } else {
//           throw new Error("Rôle utilisateur inconnu.");
//         }

//         setEtudiant({ ...data, discriminator });
//       } catch (error) {
//         console.error("Erreur :", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [userId, discriminator]);

//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   const handleProfileClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleProfileClose = () => {
//     setAnchorEl(null);
//   };

//   const openProfileDialog = () => {
//     setOpenDialog(true);
//     handleProfileClose();
//   };

//   const closeProfileDialog = () => {
//     setOpenDialog(false);
//   };

//   return (
//     <AppBar position="fixed" sx={{ backgroundColor: "#006633", boxShadow: 2 }}>
//       <Container>
//         <Toolbar>
//           <Typography
//             variant="h6"
//             sx={{
//               cursor: "pointer",
//               fontWeight: "bold",
//               fontFamily: "'Poppins', sans-serif",
//             }}
//             onClick={() => navigate("/")}
//           >
//             Parking EMSI
//           </Typography>

//           <Box sx={{ flexGrow: 1 }} />

//           {/* Navigation */}
//           <Stack direction="row" spacing={2}>
//             {pages.map((page) => (
//               <RouterLink key={page.id} to={page.path} style={{ textDecoration: "none" }}>
//                 <Typography
//                   sx={{
//                     color: "white",
//                     fontSize: "1rem",
//                     textTransform: "uppercase",
//                     fontWeight: 500,
//                     "&:hover": {
//                       color: "#ffde59",
//                     },
//                   }}
//                 >
//                   {page.name}
//                 </Typography>
//               </RouterLink>
//             ))}
//           </Stack>

//           {/* Profil */}
//           {!loading && etudiant?.nom && (
//             <>
//               <IconButton onClick={handleProfileClick} sx={{ ml: 2 }}>
//                 <Avatar sx={{ bgcolor: "#ffffff", color: "#000000" }}>
//                   {etudiant.nom?.charAt(0).toUpperCase() || "?"}
//                 </Avatar>
//               </IconButton>
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleProfileClose}
//                 sx={{ mt: "45px" }}
//               >
//                 <MenuItem onClick={openProfileDialog}>
//                   <AccountCircle sx={{ mr: 1 }} />
//                   Mon profil
//                 </MenuItem>
//                 <MenuItem onClick={handleLogout}>
//                   <Logout sx={{ mr: 1 }} />
//                   Déconnexion
//                 </MenuItem>
//               </Menu>
//             </>
//           )}
//         </Toolbar>
//       </Container>

//       {/* Dialog pour Mon Profil */}
//       <Dialog open={openDialog} onClose={closeProfileDialog} maxWidth="md" fullWidth>
//         <ProfilePageUti onClose={closeProfileDialog} etudiant={etudiant} />
//       </Dialog>
//     </AppBar>
//   );
// };

// export default Header;

import React, { useEffect, useState } from "react";
import "./Acceuil.css";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Stack,
  Toolbar,
  Typography,
  Container,
  AppBar,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
} from "@mui/material";
import EtudiantApi from "../Api/EtudiantApi";
import PersonnelApi from "../Api/PersonnelApi";
import ProfilePageUti from "./ProfilUti";
import { Logout, AccountCircle } from "@mui/icons-material";


const pages = [
  { name: "Accueil", id: "acceuil", path: "/" },
  { name: "À propos", id: "about", path: "/about" },
  { name: "Réservation", id: "reservation", path: "/parking" },
  { name: "Contact", id: "contact", path: "/contact" },
];

const Header = () => {
  const [etudiant, setEtudiant] = useState({});
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const userSessionData = JSON.parse(sessionStorage.getItem("userData"));
  const userId = userSessionData?.id;
  const discriminator = userSessionData?.discriminator;

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !discriminator) {
        setLoading(false);
        return;
      }

      try {
        let data;
        if (discriminator === "Etudiant") {
          data = await EtudiantApi.fetchEtudiantById(userId);
        } else if (discriminator === "Personnel") {
          data = await PersonnelApi.fetchPersonnelById(userId);
        } else {
          throw new Error("Rôle utilisateur inconnu.");
        }

        setEtudiant({ ...data, discriminator });
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, discriminator]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const openProfileDialog = () => {
    setOpenDialog(true);
    handleProfileClose();
  };

  const closeProfileDialog = () => {
    setOpenDialog(false);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "rgb(0, 141, 54)", boxShadow: 2 }}>
      <Container>
        <Toolbar>
          <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
            {/* Logo ou Titre */}
            <Typography
              variant="h6"
              sx={{ cursor: "pointer", fontWeight: "bold", fontFamily: "'Poppins', sans-serif" }}
              onClick={() => navigate("/")}
            >
              Parking EMSI
            </Typography>

            {/* Navigation */}
            <Stack direction="row" spacing={4}>
              {pages.map((page) => (
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

              {/* Profil */}
              {!loading && etudiant?.nom && (
                <>
                
                    
                  
                    <Avatar sx={{ bgcolor: "rgb(255, 255, 255)",color:'Black' }} onClick={handleProfileClick}>
                      {etudiant.nom?.charAt(0) || "?"}
                    </Avatar>
                  
                    <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
                sx={{ mt: "8px" }}
              >
                    <MenuItem onClick={openProfileDialog}>
                  <AccountCircle sx={{ mr: 1 }} />
                  Mon profil
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Déconnexion
                </MenuItem>
                  </Menu>
                </>
              )}
            </Stack>
          </Stack>
        </Toolbar>
      </Container>

      {/* Dialog pour Mon Profil */}
      <Dialog open={openDialog} onClose={closeProfileDialog} maxWidth="md" fullWidth>
        <ProfilePageUti onClose={closeProfileDialog} etudiant={etudiant} />
      </Dialog>
    </AppBar>
  );
};

export default Header;
