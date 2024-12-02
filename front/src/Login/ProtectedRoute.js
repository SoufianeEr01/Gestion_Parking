import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const userData = localStorage.getItem('userData');
    const location = useLocation();  // Utilisation de useLocation pour obtenir le chemin actuel

    // Si les données de l'utilisateur n'existent pas dans le localStorage
    if (!userData) {
        return <Navigate to="/login" />;
    }

    // Convertir les données de l'utilisateur en objet JavaScript
    const parsedUserData = JSON.parse(userData);

    // Si le token n'existe pas ou est invalide, rediriger vers /login
    if (!parsedUserData.token) {
        return <Navigate to="/login" />;
    }

    // Vérifier si l'utilisateur est un admin et empêcher les étudiants/personnels d'accéder à "/admin"
    if (location.pathname === '/admin' && 
        (parsedUserData.discriminator === 'Etudiant' || parsedUserData.discriminator === 'Personnel')) {
        console.log("Utilisateur avec rôle ", parsedUserData.discriminator, " tente d'accéder à /admin");
        // Rediriger l'utilisateur non admin vers une autre page, par exemple la page d'accueil
        return <Navigate to="/error403" />;
    }

    // Pages à ne pas autoriser pour l'admin ("/", "/about", "/parking", "/contact")
    const restrictedPathsForAdmin = ['/', '/about', '/parking', '/contact'];
    if (restrictedPathsForAdmin.includes(location.pathname) && parsedUserData.discriminator === 'Admin') {
        // Rediriger l'admin vers une page spécifique, par exemple la page d'accueil ou tableau de bord admin
        return <Navigate to="/error403" />;
    }

    return children; // Si tout est ok, afficher le contenu protégé
};

export default ProtectedRoute;
