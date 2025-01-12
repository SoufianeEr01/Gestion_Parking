import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactItem = ({ icon, title, content }) => (
  <Paper
    elevation={0}
    sx={{
      
      p: 2,
      mb: 2,
      borderRadius: 4,
      backgroundColor: 'transparent',
      border: '1px solid #e0e0e0',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        borderColor: '#2e7d32',
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
      <Box
        sx={{
          mr: 2,
          p: 1,
          borderRadius: 2,
          backgroundColor: '#f1f8e9',
          color: '#2e7d32',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: '#1b5e20',
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#546e7a',
            lineHeight: 1.6,
          }}
        >
          {content}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const ContactInfo = () => {
  return (
    <Box>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: '#1b5e20',
          mb: 2,
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -12,
            left: 0,
            width: 100,
            height: 4,
            backgroundColor: '#2e7d32',
            borderRadius: 2,
          }
        }}
      >
        Contactez-nous
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 6,
          color: '#546e7a',
          maxWidth: 500,
          lineHeight: 1.8,
          mt: 4,
          color: 'black',
        }}
      >
        Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions
        concernant notre système de gestion de parking intelligent.
      </Typography>

      <ContactItem
        icon={<Phone size={24} />}
        title="Téléphone"
        content="+212 522 894 287"
      />
      <ContactItem
        icon={<Mail size={24} />}
        title="Email"
        content="contact@parking-emsi.ma"
      />
      <ContactItem
        icon={<MapPin size={24} />}
        title="Adresse"
        content="Lotissement Alkhawarizmi, quartier laymoune"
      />
      <ContactItem
        icon={<Clock size={24} />}
        title="Heures d'ouverture"
        content={
          <>
            Lun - Ven: 9h00 - 18h00
            <br />
            Sam: 9h00 - 12h00
          </>
        }
      />
    </Box>
  );
};

export default ContactInfo;