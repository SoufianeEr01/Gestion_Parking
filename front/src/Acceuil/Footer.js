import { Box, Typography, Stack, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useNavigate } from 'react-router-dom';



function Footer() {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Accueil', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Parking', path: '/parking' },
    { label: 'Emploi', path: '/emploi' },
    { label: 'Contact', path: '/contact' },
  ];
  return (
    <Box
      sx={{
         marginTop:"100px",
        left: 0,
        bottom:0,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fond noir semi-transparent
        color: 'white',
        padding: '40px 0px 40px 0px',
        textAlign: 'center',
        zIndex: 1000,       // S'assure que le footer est au-dessus d'autres éléments
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)', //
      }}
    >
      {/* Logo ou nom de la compagnie */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2}}>
        Parking EMSI
      </Typography>

      {/* Lien de navigation */}
      <Stack direction="row" justifyContent="center" spacing={4} mb={2}>
      {menuItems.map((item) => (
        <Link
          key={item.label}
          onClick={() => navigate(item.path)} // Utilisation de `useNavigate` pour rediriger
          underline="none"
          sx={{
            cursor: 'pointer',
            color: 'white',
            transition: 'color 0.3s',
            '&:hover': { color: '#4bb752' }, // Couleur verte au survol
          }}
        >
          {item.label}
        </Link>
      ))}
    </Stack>

      {/* Icônes des réseaux sociaux */}
      <Stack direction="row" justifyContent="center" spacing={2} mb={2}>
        {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
          <IconButton
            key={index}
            color="inherit"
            href="#"
            sx={{
              '&:hover': { color: '#4bb752' }, // Couleur verte au survol
            }}
          >
            <Icon />
          </IconButton>
        ))}
      </Stack>

      {/* Informations de contact */}
      <Typography variant="body2" sx={{ mb: 1 }}>
        Contacter nous sur: <Link href="mailto:contact@parking-emsi.ma" sx={{ color: '#4bb752' }}>contact@parking-emsi.ma</Link>
      </Typography>
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Emsi - Tous les droits sont réservés.
      </Typography>
    </Box>
  );
}

export default Footer;
