import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Acceuil from './Acceuil/Acceuil';
import About from './About/About';
import Footer from './Acceuil/Footer';
import Header from './Acceuil/Header';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme';
import './App.css';
import Parking from './Reservation/Parking';
import LoginPage from './Login/login';
import SignUpPage from './Login/inscription';
import ProtectedRoute from './Login/ProtectedRoute';
import Dashboard from './Admin/Dashbord/PagePrincipal';
import Error403Page from './error/error403';
import EtudiantDetailPage from './EtudiantDetailPage';
import Error404Page from './error/error404';
import PaymentComponent from './Reservation/steps/PaymentComponent';

import ContactPage from './contact/ContactPage';
import ProfilePageUti from './Acceuil/ProfilUti';

import PlaceReservationDialog from './Reservation/PlaceReservationDialog';
function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <AppWithRouter />
        </Router>
      </ThemeProvider>
    </div>
  );
}

function AppWithRouter() {
  const location = useLocation(); // Utilisé ici, dans un contexte sous Router

  // Vérifier si la route actuelle est "/login" ou "/inscription"
  const isLoginOrSignupPage = location.pathname === '/' || location.pathname === '/about' || location.pathname === '/parking'|| location.pathname === '/contact';

  return (
    <div>
      {/* Afficher le Header et Footer sauf si la route est /login ou /inscription */}
      {isLoginOrSignupPage && <Header />}

      {/* Définir les routes */}
      <Routes>
      <Route path="/detail" element={
            <EtudiantDetailPage />} />
      <Route path="/admin" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/" element={
            <ProtectedRoute><Acceuil /></ProtectedRoute>} />
        <Route path="/about" element={
            <ProtectedRoute><About /></ProtectedRoute>} />

       
        <Route path="/profil" element={
            <ProfilePageUti />} />

        <Route path="/PlaceReservationDialog" element={
            <PlaceReservationDialog />} />
        <Route path="/paiement" element={
            <PaymentComponent />} />
        <Route path="/error403" element={
            <Error403Page />} />
          <Route path="*" element={<Error404Page />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Route protégée */}
        <Route
          path="/parking"
          element={
            <ProtectedRoute>
              <Parking />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/inscription" element={<SignUpPage />} />
      </Routes>

      {/* Afficher le Footer sauf si la route est /login ou /inscription */}
      {isLoginOrSignupPage && <Footer />}
    </div>
  );
}

export default App;
