import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Typography,
  
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReservationApi from "../../Api/ReservationApi";

function Reservation() {
  const defaultReservation = {
    date: "",
    heureDebut: "",
    heureFin: "",
    lieu: "",
    personne_id: "",
    placeParking_id: "",
  };

  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState(defaultReservation);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [dialogs, setDialogs] = useState({ add: false, edit: false, confirm: false });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [reservationToDelete, setReservationToDelete] = useState(null);
   const [page, setPage] = useState(1);
  const placesPerPage = 5;
  // Pagination states
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchReservations = async () => {
    try {
      const data = await ReservationApi.fetchReservations();
      setReservations(data);
    } catch (error) {
      setErrorMessage("Erreur lors de la récupération des réservations.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const validateFields = () => {
    const { date, heureDebut, heureFin, lieu, personne_id, placeParking_id } = newReservation;
    const today = new Date().toISOString().split("T")[0]; // Format 'YYYY-MM-DD'

    if (!date || !heureDebut || !heureFin || !lieu || !personne_id || !placeParking_id) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return false;
    }

    if (date < today) {
      setErrorMessage("La date doit être aujourd'hui ou dans le futur.");
      return false;
    }

    return true;
  };

  const addReservation = async () => {
    if (!validateFields()) return;

    try {
      await ReservationApi.createReservation(newReservation);
      setSuccessMessage("Réservation ajoutée avec succès !");
      setDialogs({ ...dialogs, add: false });
      setNewReservation(defaultReservation);
      fetchReservations();
    } catch (error) {
      setErrorMessage("Erreur lors de la création de la réservation.");
    }
  };

  const updateReservation = async () => {
    if (!validateFields()) return;

    try {
      await ReservationApi.updateReservation(selectedReservation.id, newReservation);
      setSuccessMessage("Réservation mise à jour avec succès !");
      setDialogs({ ...dialogs, edit: false });
      fetchReservations();
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour de la réservation.");
    }
  };

  const deleteReservation = async () => {
    try {
      await ReservationApi.deleteReservation(reservationToDelete.id);
      setSuccessMessage("Réservation supprimée avec succès !");
      setDialogs({ ...dialogs, confirm: false });
      fetchReservations();
    } catch (error) {
      setErrorMessage("Erreur lors de la suppression de la réservation.");
    }
  };

  const handleInputChange = (field, value) => {
    setNewReservation({ ...newReservation, [field]: value });
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="contained" color="success" onClick={() => setDialogs({ ...dialogs, add: true })}>
        +Ajouter une réservation
      </Button>
      <Table sx={{ mt: 3.5 }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Heure Début</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Heure Fin</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Lieu</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Personne ID</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Place Parking ID</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.date}</TableCell>
              <TableCell>{reservation.heureDebut}</TableCell>
              <TableCell>{reservation.heureFin}</TableCell>
              <TableCell>{reservation.lieu}</TableCell>
              <TableCell>{reservation.personne_id}</TableCell>
              <TableCell>{reservation.placeParking_id}</TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => {
                    setSelectedReservation(reservation);
                    setNewReservation(reservation);
                    setDialogs({ ...dialogs, edit: true });
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    setReservationToDelete(reservation);
                    setDialogs({ ...dialogs, confirm: true });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
       <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={Math.ceil(reservations.length / placesPerPage-1)}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                color="success"
              />
            </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogs.add || dialogs.edit} onClose={() => setDialogs({ add: false, edit: false })}>
        <DialogTitle>{dialogs.add ? "Ajouter une réservation" : "Modifier la réservation"}</DialogTitle>
        <DialogContent>
          <TextField
            color="success"
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            required
            value={newReservation.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
          <TextField
            color="success"
            label="Heure Début"
            type="time"
            fullWidth
            margin="normal"
            required
            value={newReservation.heureDebut}
            onChange={(e) => handleInputChange("heureDebut", e.target.value)}
          />
          <TextField
            color="success"
            label="Heure Fin"
            type="time"
            fullWidth
            margin="normal"
            required
            value={newReservation.heureFin}
            onChange={(e) => handleInputChange("heureFin", e.target.value)}
          />
          <TextField
            color="success"
            label="Lieu"
            fullWidth
            margin="normal"
            required
            value={newReservation.lieu}
            onChange={(e) => handleInputChange("lieu", e.target.value)}
          />
          <TextField
            color="success"
            label="Personne ID"
            fullWidth
            margin="normal"
            required
            value={newReservation.personne_id}
            onChange={(e) => handleInputChange("personne_id", e.target.value)}
            disabled={dialogs.edit}
          />
          <TextField
            color="success"
            label="Place Parking ID"
            fullWidth
            margin="normal"
            required
            value={newReservation.placeParking_id}
            onChange={(e) => handleInputChange("placeParking_id", e.target.value)}
            disabled={dialogs.edit}

          />
        </DialogContent>
        <DialogActions>
          <Button color="black" onClick={() => setDialogs({ add: false, edit: false })}>
            Annuler
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={dialogs.add ? addReservation : updateReservation}
          >
            {dialogs.add ? "Ajouter" : "Modifier"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={dialogs.confirm} onClose={() => setDialogs({ ...dialogs, confirm: false })}>
        <DialogTitle style={{textAlign:'center'}}>Supprimer la réservation</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cette réservation ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogs({ ...dialogs, confirm: false })} color="Black">Annuler</Button>
          <Button color="error" variant="contained" onClick={deleteReservation}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
      />
    </Box>
  );
}

export default Reservation;
