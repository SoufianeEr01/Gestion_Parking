import React, { useState } from 'react';
import { Container, Grid, Box } from '@mui/material';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)',
        minHeight: '100vh',
        py: 8,
        marginTop: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <ContactInfo />
          </Grid>
          <Grid item xs={12} md={6}>
            <ContactForm
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactPage;