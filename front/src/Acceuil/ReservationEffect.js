import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, IconButton, Box, Button ,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,} from '@mui/material';
import  CircularPro from './CircularPro'; // Import the new component
import ReservationApi from '../Api/ReservationApi';
import EtudiantApi from '../Api/EtudiantApi'; 
import PersonnelApi from '../Api/PersonnelApi'; 
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; 
import { User, MapPin, Calendar, Clock, CreditCard } from 'lucide-react';

const ReservationEffect = ({ personne, onClose }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // Nouveau state pour le dialogue de confirmation
  const [reservations, setReservations] = useState([]);
  const [userData, setUserData] = useState({
    id: 0,
    nom: "",
    prenom: "",
    email: "",
    discriminator: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstDate, setFirstDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);
  const [progress, setProgress] = useState(0);

  const fetchReservations = async () => {
    try {
      const data = await ReservationApi.fetchReservationById_personne(userData.id);
      if (data && data.length > 0) {
        const sortedReservations = [...data].sort(
          (a, b) => new Date(a.dateReservation) - new Date(b.dateReservation)
        );
        setReservations(sortedReservations);
        setFirstDate(sortedReservations[0].dateReservation);
        setLastDate(sortedReservations[sortedReservations.length - 1].dateReservation);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [userData.id]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!personne.id || !personne.discriminator) {
        setError("Utilisateur non valide.");
        setLoading(false);
        return;
      }

      try {
        let data;
        if (personne.discriminator === "Etudiant") {
          data = await EtudiantApi.fetchEtudiantById(personne.id);
        } else if (personne.discriminator === "Personnel") {
          data = await PersonnelApi.fetchPersonnelById(personne.id);
        } else {
          throw new Error("Rôle utilisateur inconnu.");
        }

        setUserData({ ...data, discriminator: personne.discriminator });
      } catch (error) {
        setError("Erreur lors de la récupération des données.");
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [personne]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

 
  const handleConfirmCancel = async () => {
    setConfirmDialogOpen(false); // Fermer le dialogue de confirmation
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      const idPersonne = userData?.id;
  
      // Appel de l'API pour archiver les réservations
      const message = await ReservationApi.archiverReservationsPourPersonne(idPersonne);
      setReservations([]); // Réinitialiser la liste après annulation
  
      setIsSuccess(true);
      setDialogMessage(message); // Afficher le message de succès
    } catch (error) {
      console.error("Erreur lors de l'annulation des réservations :", error);
      setIsSuccess(false);
      setDialogMessage(
        "Une erreur s'est produite lors de l'annulation des réservations. Veuillez réessayer plus tard."
      );
    } finally {
      setDialogOpen(true); // Ouvrir le dialogue pour le message final
      if (onClose) onClose(); // Fermer le dialogue parent si nécessaire
    }
  };
  


  const calculateRemainingTime = () => {
    const NbrReservationRest = reservations.length;
    return `${NbrReservationRest} jour(s)`;
  };

  const generatePDF = () => {
    const doc = new jsPDF({ format: 'a5', orientation: 'portrait' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const logoUrl = './images/logo_emsi.png'; 
    doc.addImage(logoUrl, 'PNG', pageWidth - 60, 5, 50, 15);

    // Titre de la facture
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0); // Texte noir
    doc.text('Facture de Réservation', 10, 15);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR'); 
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text(`Date: ${formattedDate}`, pageWidth - 50, 40);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 30, pageWidth - 10, 30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Nom:', 10, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(`${userData.nom} ${userData.prenom}`, 25, 40);

    doc.setFont('helvetica', 'bold');
    doc.text('Email:', 10, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(userData.email, 25, 50);

    doc.setFont('helvetica', 'bold');
    doc.text('Rôle:', 10, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(personne.discriminator, 25, 60);

    doc.setFont('helvetica', 'bold');
    doc.text('Place de Parking:', 10, 70);
    doc.setFont('helvetica', 'normal ');
    doc.text(reservations[0]?.numeroPlace || 'Non disponible', 50, 70);

    doc.autoTable({
        startY: 95,
        head: [['Date', 'Heure de Début', 'Heure de Fin']],
        body: reservations.map((res) => [
            res.dateReservation || 'Non disponible',
            res.heureDebut || 'Non disponible',
            res.heureFin || 'Non disponible',
        ]),
        headStyles: {
            fillColor: [0, 141, 54],
            textColor: [255, 255, 255],
        },
        bodyStyles: {
            textColor: [0, 0, 0],
        },
        styles: {
            halign: 'center',
        },
    });

    const finalY = doc.autoTable.previous.finalY;
    doc.setFontSize(16);
    doc.setTextColor(0, 128, 0);
    doc.text('Cachet: PAYÉ', 70, finalY + 20);

    doc.save('facture_reservation.pdf');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
        <CircularPro value={progress} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const remainingTime =  calculateRemainingTime();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, backgroundColor: '#white' }}>
        <Card sx={{ maxWidth: 800, width: '100%',height: '100%', borderRadius: 2 }}>
          <CardContent sx={{ backgroundColor: '#008d36', color: 'white', paddingBottom: 2 }}>
            <Typography variant="h5" gutterBottom>
              Réservation de Parking
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Détails de la réservation  
            </Typography>
          </CardContent>
  
          <CardContent>
            <Grid container spacing={3}>
              {/* Infos utilisateur */}
              <Grid item xs={12} md={12}>
                <Box display="flex" alignItems="center" sx={{ padding: 2, backgroundColor: '#e0f2fe', borderRadius: 2 }}>
                  <IconButton sx={{ backgroundColor: 'white', borderRadius: '50%', padding: 2 ,color: 'black'}}>
                    <User size={24} className="text-blue-600" />
                  </IconButton>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      {personne.discriminator === "Personnel" ? "Personnel" : "Étudiant"}
                    </Typography>
                    <Typography variant="h6">{`${userData.nom} ${userData.prenom}`}</Typography>
                    {personne.discriminator === "Etudiant" && (
                      <>
                      <Typography variant="body2">Matricule : {userData.id}</Typography>
                      </>
                    )}
                    {personne.discriminator === "Personnel" && (
                      <Typography variant="body2">Role : {userData.role}</Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
  
            </Grid>
  
            {/* Infos supplémentaires */}
            <Grid container spacing={3} sx={{ marginTop: 1 }}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" sx={{ padding: 2, backgroundColor: '#e0f2fe', borderRadius: 2 }}>
                  <IconButton sx={{ backgroundColor: 'white', borderRadius: '50%', padding: 2,color: 'black' }}>
                    <Calendar size={24} className="text-blue-600" />
                  </IconButton>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                    Prochaine réservation
                    </Typography>
                    <Typography variant="h6">{firstDate || "Non disponible"}</Typography>
                  </Box>
                </Box>
              </Grid>
  
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" sx={{ padding: 2, backgroundColor: '#e0f2fe', borderRadius: 2 }}>
                  <IconButton sx={{ backgroundColor: 'white', borderRadius: '50%', padding: 2 ,color: 'black'}}>
                    <Calendar size={24} className="text-blue-600" />
                  </IconButton>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                    Date butoir
                    </Typography>
                    <Typography variant="h6">{lastDate || "Non disponible"}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ marginTop: 1 }}>
            <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" sx={{ padding: 2, backgroundColor: '#e0f2fe', borderRadius: 2 }}>
            <IconButton sx={{ backgroundColor: 'white', borderRadius: '50%', padding: 2,color: 'black' }}>
            <HourglassBottomIcon sx={{ fontSize: 24, color: 'black' }} />
            </IconButton>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Jours Restant
                </Typography>
                <Typography variant="h6">{ remainingTime || "Aucune"} </Typography>
              </Box>
            </Box>
          </Grid>
            <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" sx={{ padding: 2, backgroundColor: '#e0f2fe', borderRadius: 2 }}>
                  <IconButton sx={{ backgroundColor: 'white', borderRadius: '50%', padding: 2,color: 'black' }}>
                    <MapPin size={24} className="text-blue-600" />
                  </IconButton>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Place de Parking
                    </Typography>
                    <Typography variant="h6"> Place {reservations[0]?.numeroPlace || "Non assigné"}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <CardContent sx={{ textAlign: 'center',display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            {reservations.length>0&&
            <>
          <Button variant="contained" color="success" onClick={generatePDF} sx={{ marginRight: 2 }}>
            Imprimer la Facture
          </Button>
          <Button variant="contained" color="error" onClick={handleOpenConfirmDialog}>
              Annuler mes réservations
            </Button>
            </>
          }
            </CardContent>
          <hr></hr>
          <CardContent sx={{ textAlign: 'center'                                                  }}>
            <Typography variant="body2"  color='#6b7280' font-size=' 0.875rem' margin='0'>
            Cette réservation est valide uniquement pour les dateReservation indiqués.          </Typography>
          </CardContent>
        </Card>

      </Box>
      {/* Dialogue de confirmation */}
      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmer l'annulation</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir annuler toutes vos réservations ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} variant="outlined">
            Annuler
          </Button>
          <Button onClick={handleConfirmCancel} variant="contained" color="error">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de succès/erreur */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isSuccess ? "Succès" : "Erreur"}</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" color={isSuccess ? "success" : "error"}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
};

export default ReservationEffect;
