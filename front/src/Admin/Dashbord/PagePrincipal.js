import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, Menu, Dialog, Divider, MenuItem, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
// Import des composants
import Etudiant from './EtudiantContenu';
import Personnel from './PersonnelContenu';
import PlaceParking from './PlaceParking';
import EmploisContenu from './EmploisContenu';
import Reservation from './Reservation';
import Groupe from './Groupe';
import ProfilePage from '../../Admin/Dashbord/Profil';
import AdminApi from "../../Api/AdminApi";
import ContactManagement from './ContactAdmin';
import CommentIcon from '@mui/icons-material/Comment';
import TableauDeBord from './TableauDeBord';
import Logout from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaiementDashbord from './PaiementDashbord';
import CreditScoreIcon from '@mui/icons-material/CreditScore';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#edf2f7' },
  },
  typography: {
    fontFamily: 'cursive',
    h6: { fontWeight: 'bold' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#008d36',
          color: '#fff',
        },
      },
    },
  },
});

function Dashboard() {
  const [currentPage, setCurrentPage] = useState('Accueil');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [adminData, setAdminData] = useState({ id: 0, nom: "", prenom: "", email: "" });

  const navigate = useNavigate();
  const adminId = JSON.parse(sessionStorage.getItem("userData"))?.id;

  useEffect(() => {
    const fetchAdmin = async () => {
      if (!adminId) return;
      try {
        const data = await AdminApi.fetchAdminById(adminId);
        setAdminData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données.");
      }
    };
    fetchAdmin();
  }, [adminId]);

  const handleCloseDialog = async () => {
    setOpenDialog(false);
    try {
      const data = await AdminApi.fetchAdminById(adminId);
      setAdminData(data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données après fermeture :", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <TableauDeBord />;
      case 'Étudiants':
        return <Etudiant />;
      case 'Personnels':
        return <Personnel />;
      case 'Places Parking':
        return <PlaceParking />;
      case 'Emplois':
        return <EmploisContenu />;
      case 'Groupes':
        return <Groupe />;
      case 'Réservation':
        return <Reservation />;
      case 'Paiement':
        return <PaiementDashbord />;
      case 'Contact':
          return <ContactManagement />;
      
      default:
        return <TableauDeBord />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' }}>
        {/* Menu latéral */}
        <Box
          sx={{
            width: menuOpen ? 240 : 90,
            flexShrink: 0,
            backgroundColor: '#fff',
            borderRight: '1px solid #ddd',
            transition: 'width 0.3s ease',
          }}
        >
          <Button
            onClick={toggleMenu}
            sx={{
              margin: 2,
              backgroundColor: '#008d36',
              color: '#fff',
              '&:hover': { backgroundColor: '#008d36' },
            }}
          >
            {menuOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </Button>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2, gap: 1 }}>
  {[
    { label: 'Tableau de bord', icon: <DashboardIcon /> },
    { label: 'Étudiants', icon: <SchoolIcon /> },
    { label: 'Personnels', icon: <PersonIcon /> },
    { label: 'Places Parking', icon: <LocalParkingIcon /> },
    { label: 'Emplois', icon: <CalendarTodayIcon /> },
    { label: 'Groupes', icon: <GroupIcon /> },
    { label: 'Contact', icon: <CommentIcon/> },
    { label: 'Réservation', icon: <SettingsIcon /> },
    { label: 'Paiement', icon: <CreditScoreIcon /> },



  ].map((item, index) => (
    <React.Fragment key={item.label}>
      <Button
        onClick={() => setCurrentPage(item.label)}
        sx={{
          width: '90%',
          justifyContent: menuOpen ? 'flex-start' : 'center',
          textTransform: 'none',
          color: '#555',
          padding: menuOpen ? '10px 20px' : '10px',
          borderRadius: 2,
          '&:hover': { backgroundColor: '#f0f0f0' },
        }}
      >
        {item.icon}
        {menuOpen && (
          <Typography  color ="Black" variant="body2" sx={{ marginLeft: 2 }}>
            {item.label}
          </Typography>
        )}
      </Button>
      {index < 8 && <Divider sx={{ width: '80%', mx: 'auto' }} />}
    </React.Fragment>
  ))}

  {/* Séparateur entre Groupes et Réservation */}

</Box>

        </Box>

        {/* Contenu principal */}
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }} color="Black">
                Gestion des - {currentPage}
              </Typography>
              <Button
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ backgroundColor: 'inherit', '&:hover': { backgroundColor: 'white', color: 'black' } }}
              >
                {adminData.nom} {adminData.prenom} <ArrowDropDownIcon />
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: "8px" }}
              >
                <MenuItem onClick={handleOpenDialog}>
                  <AccountCircle sx={{ mr: 1 }} />
                    Mon profil
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                    Déconnexion
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <Box sx={{ padding: 3 }}>{renderPageContent()}</Box>
        </Box>

        {/* Dialogue pour le profil */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <ProfilePage onClose={handleCloseDialog} />
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
