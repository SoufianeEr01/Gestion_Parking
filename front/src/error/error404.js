import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Error404Page = () => {
    const navigate = useNavigate();  // Hook pour la redirection

    const handleGoHome = () => {
        navigate(-1);  // Rediriger vers la page d'accueil
    };

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: 'rgb(8, 151, 66)',  // Couleur d'arrière-plan
                color: '#fff',
                textAlign: 'center',
                padding: 2,
            }}
        >
            <Box>
                <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 'bold' }}>
                    404
                </Typography>
                <Typography variant="h4" sx={{ marginBottom: 3 }}>
                    Page non trouvée
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                        padding: '10px 20px',
                        fontSize: '1rem',
                        backgroundColor: '#fff',
                        color: 'rgb(8, 151, 66)',
                        '&:hover': {
                            backgroundColor: '#f1f1f1',
                        },
                    }}
                    onClick={handleGoHome}
                >
                    Retourner à la page précédente
                </Button>
            </Box>
        </Container>
    );
};

export default Error404Page;
