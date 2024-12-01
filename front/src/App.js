import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
           {/* <Header />   */}

          {/* Définir les routes */}
          <Routes>
            <Route path="/" element={<Acceuil />} /> {/* Route pour la page d'accueil */}
            <Route path="/about" element={<About />} /> {/* Route pour la page About */}
            <Route path="/parking" element={<Parking />} /> {/* Route pour la page About */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/inscription" element={<SignUpPage />} />  

          </Routes>

          <Footer />  {/* Afficher le footer sur toutes les pages */}
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
