import React, { useState, useEffect } from "react";
import EmploiPersonnelApi from "../../Api/EmploisPersonnelApi";
import EmploiApi from "../../Api/EmploiApi";
import { CircularProgress, Typography, Box } from "@mui/material";
import styled from "styled-components";
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Wrapper = styled.div`
const Wrapper = styled.div
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "Poppins", sans-serif;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    min-height: 100vh;
  }

  .main {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
    margin-top: 6rem;
  }

  .schedule-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .day-card {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
  }

  .day-card:hover {
    transform: translateY(-4px);
  }

  .day-header {
    background: #008d36;
    padding: 1rem;
    text-align: center;
  }

  .day-title {
    color: white;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .time-slots {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .time-slot {
    background: #f0fdf4;
    padding: 1rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: background-color 0.2s ease;
  }

  .time-slot:hover {
    background: #dcfce7;
  }

  .time-text {
    color: black;
    font-weight: 500;
  }
  .time-slot .MuiSvgIcon-root {
    color: black; /* Couleur noire pour les icônes */
    font-size: 1.2rem; /* Ajuste la taille */
  }
`;

const EmploisList = () => {
  const [emplois, setEmplois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userSessionData = JSON.parse(sessionStorage.getItem("userData"));
  const userId = userSessionData?.id;
  const userDisc = userSessionData?.discriminator;

  const fetchEmplois = async () => {
    try {
      setLoading(true);
      if (userDisc === "Personnel") {
        const data = await EmploiPersonnelApi.getEmploiByPersonnel(userId);
      const joursOrdre = [0, 1, 2, 3, 4, 5];
      const filteredAndSortedData = data
        .filter(emploi => joursOrdre.includes(emploi.jour)) 
        .sort((a, b) => a.jour - b.jour); 
      setEmplois(filteredAndSortedData);
      } else if (userDisc === "Etudiant") {
        const data = await EmploiApi.fetchEmploiByIdEtudiant(userId);
        const joursOrdre = [0, 1, 2, 3, 4, 5];
        const filteredAndSortedData = data
          .filter(emploi => joursOrdre.includes(emploi.jour)) 
          .sort((a, b) => a.jour - b.jour); 
        setEmplois(filteredAndSortedData);
      }
    } catch (error) {
      setError("Erreur lors de la récupération des emplois.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmplois();
  }, [userId]);

  const jourparnum = (jourNum) => {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return jours[jourNum] || "Inconnu";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary" style={{ marginLeft: "15px" }}>
          Chargement des emplois...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Wrapper>
      <div className="main">
      <Typography 
  variant="h4" 
  style={{ 
    textAlign: "center", 
    marginBottom: "2rem", 
    color: "green", 
    textDecoration: "underline", 
    textDecorationColor: "green", 
    textDecorationThickness: "3px", 
    textUnderlineOffset: "6px" ,
    fontSize: "3rem",
  }}
>
  Emploi du Temps
</Typography>
        {emplois.length === 0 ? (
          <Typography variant="h6" color="textSecondary" style={{ textAlign: "center" }}>
            Aucun emploi trouvé pour ce personnel.
          </Typography>
        ) : (
          <div className="schedule-grid">
            {emplois.map((emploi) => (
              <div className="day-card" key={emploi.Id}>
                <div className="day-header">
                  <h2 className="day-title">{jourparnum(emploi.jour)}</h2>
                </div>
                <div className="time-slots">
                  {userDisc === "Etudiant" ? (
                    <>
                      <div className="time-slot">
                        <AccessTimeIcon />
                        <span className="time-text">{emploi.dateDebut}</span>
                      </div>
                      <div className="time-slot">
                        <HourglassDisabledIcon />
                        <span className="time-text">{emploi.dateFin}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="time-slot">
                        <AccessTimeIcon />
                        <span className="time-text">{emploi.heureDebut}</span>
                      </div>
                      <div className="time-slot">
                        <HourglassDisabledIcon />
                        <span className="time-text">{emploi.heureFin}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default EmploisList;
