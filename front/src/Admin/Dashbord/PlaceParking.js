import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlaceParkingApi from "../../Api/PlaceParkingApi";

const PlaceParking = () => {
  // State management
  const [places, setPlaces] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // for confirmation dialog
  const [editingPlace, setEditingPlace] = useState(null);
  const [placeData, setPlaceData] = useState({ numero: "", etat: "" });
  const [feedbackMessage, setFeedbackMessage] = useState({ success: "", error: "" });
  const [page, setPage] = useState(1);
  const placesPerPage = 5;
  const [placeToDelete, setPlaceToDelete] = useState(null); // store the place to be deleted

  // Fetch parking places
  const fetchPlaces = async () => {
    try {
      const data = await PlaceParkingApi.fetchPlaceParkings();
      setPlaces(data);
    } catch (error) {
      setFeedbackMessage({ success: "", error: "Erreur lors de la récupération des places." });
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlaceData((prevData) => ({
      ...prevData,
      [name]: name === "numero" ? String(value) : value,
    }));
  };

  // Add or update a parking place
  const handleSubmit = async () => {
    const { numero, etat } = placeData;

    if (!String(numero).trim() || !String(etat).trim()) {
      setFeedbackMessage({ success: "", error: "Tous les champs sont obligatoires !" });
      return;
    }

    try {
      if (editingPlace) {
        await PlaceParkingApi.updatePlaceParking(editingPlace.id, { numero: String(numero), etat });
        setFeedbackMessage({ success: "Place modifiée avec succès !", error: "" });
      } else {
        await PlaceParkingApi.createPlaceParking({ numero: String(numero), etat });
        setFeedbackMessage({ success: "Place ajoutée avec succès !", error: "" });
      }
      setOpenDialog(false);
      setPlaceData({ numero: "", etat: "" });
      fetchPlaces();
    } catch {
      setFeedbackMessage({ success: "", error: "Erreur lors de l'opération." });
    }
  };

  // Open the dialog for adding/editing a place
  const openDialogForEdit = (place) => {
    setEditingPlace(place);
    setPlaceData(place || { numero: "", etat: "" });
    setOpenDialog(true);
  };

  // Delete a parking place (trigger confirmation dialog)
  const handleDelete = (place) => {
    setPlaceToDelete(place); // Set the place to delete
    setOpenConfirmDialog(true); // Open the confirmation dialog
  };

  // Confirm the deletion
  const handleConfirmDelete = async () => {
    if (placeToDelete) {
      try {
        await PlaceParkingApi.deletePlaceParking(placeToDelete.id);
        setFeedbackMessage({ success: "Place supprimée avec succès !", error: "" });
        fetchPlaces();
      } catch {
        setFeedbackMessage({ success: "", error: "Erreur lors de la suppression de la place." });
      }
    }
    setOpenConfirmDialog(false); // Close the confirmation dialog
  };

  // Cancel the deletion
  const handleCancelDelete = () => {
    setOpenConfirmDialog(false); // Close the confirmation dialog
    setPlaceToDelete(null); // Reset the place to delete
  };

  // Pagination calculations
  const indexOfLastPlace = page * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = places.slice(indexOfFirstPlace, indexOfLastPlace);

  return (
    <Box sx={{ padding: 3 }}>
      <Button
        variant="contained"
        color="success"
        onClick={() => openDialogForEdit(null)}
      >
        + Ajouter une Place
      </Button>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle textAlign="center">
          {editingPlace ? "Modifier une Place" : "Ajouter une Place"}
        </DialogTitle>
        <DialogContent>
          <TextField
          color="success"
            label="Numéro"
            name="numero"
            value={placeData.numero}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth required sx={{ mt: 2 }}>
            <InputLabel>État</InputLabel>
            <Select
            color="success"
              name="etat"
              value={placeData.etat}
              onChange={handleChange}
              label="État"
              required
            >
              <MenuItem value="Libre">Libre</MenuItem>
              <MenuItem value="Occupée">Occupée</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            color="success"
            variant="contained"
            
          >
            {editingPlace ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={!!(feedbackMessage.success || feedbackMessage.error)}
        autoHideDuration={6000}
        onClose={() => setFeedbackMessage({ success: "", error: "" })}
        message={feedbackMessage.success || feedbackMessage.error}
      />

      {/* Parking Places Table */}
      <Table sx={{ mt: 3.5 }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Numéro</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>État</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPlaces.map((place) => (
            <TableRow key={place.id}>
              <TableCell>{place.numero}</TableCell>
              <TableCell>{place.etat}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => openDialogForEdit(place)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(place)}>
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
          count={Math.ceil(places.length / placesPerPage)}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
          color="success"
        />
      </Box>

      {/* Confirmation Delete Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cette place ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlaceParking;