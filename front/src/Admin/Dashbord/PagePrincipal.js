import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography  from '@mui/material/Typography';
import {Box  , Menu} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group'; // Import de l'icône "Groupe"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';

// Import des composants
import Etudiant from './EtudiantContenu';
import Personnel from './PersonnelContenu';
import PlaceParking from './PlaceParking';
import EmploisContenu from './EmploisContenu';
import Groupe from './Groupe'; // Assurez-vous que le composant Groupe est importé

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#edf2f7',
    },
  },
  typography: {
    fontFamily: 'cursive',
    h6: {
      fontWeight: 'bold',
    },
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
  const [currentPage, setCurrentPage] = React.useState('Accueil');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(true);

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const renderPageContent = () => {
    switch (currentPage) {
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
      default:
        return <Typography variant="h5" textAlign={'center'}>Bienvenue au Tableau de Bord</Typography>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' ,position:'relative',top: 0,
  left: 0}}>
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 2,
              gap: 1,
            }}
          >
            {[
              { label: 'Étudiants', icon: <SchoolIcon /> },
              { label: 'Personnels', icon: <PersonIcon /> },
              { label: 'Places Parking', icon: <LocalParkingIcon /> },
              { label: 'Emplois', icon: <CalendarTodayIcon /> },
              { label: 'Groupes', icon: <GroupIcon /> }, // Ajout du bouton "Groupe"
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
                    <Typography variant="body2" sx={{ marginLeft: 2 }}>
                      {item.label}
                    </Typography>
                  )}
                </Button>
                {index < 4 && <Divider sx={{ width: '80%', mx: 'auto' }} />}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        {/* Contenu principal */}
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Gestion des - {currentPage}
              </Typography>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <Avatar alt="Admin" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleMenuClose}>Profil</MenuItem>
                <MenuItem onClick={handleMenuClose}>Paramètres</MenuItem>
                <MenuItem onClick={handleMenuClose}>Déconnexion</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <Box sx={{ padding: 3 }}>{renderPageContent()}</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
