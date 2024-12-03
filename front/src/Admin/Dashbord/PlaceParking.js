import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Divider,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const API_PLACE_PARKING = "https://localhost:7031/api/PlaceParking";

function PlaceParking() {
  const [places, setPlaces] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [newPlace, setNewPlace] = useState({ numero: "", etat: "VIDE" });
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [placesPerPage] = useState(5);

  // Récupérer les places de parking
  const fetchPlaces = async () => {
    try {
      const response = await axios.get(API_PLACE_PARKING);
      setPlaces(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des places de parking:", error);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingPlace) {
      setEditingPlace({ ...editingPlace, [name]: value });
    } else {
      setNewPlace({ ...newPlace, [name]: value });
    }
  };

  // Ajouter une place de parking
  const addPlace = async () => {
    if (!newPlace.numero) {
      alert("Le numéro de la place est obligatoire !");
      return;
    }
    setLoading(true);
    try {
      await axios.post(API_PLACE_PARKING, newPlace);
      fetchPlaces(); // Actualiser les données après l'ajout
      setNewPlace({ numero: "", etat: "VIDE" });
      setSuccessMessage("Place ajoutée avec succès !");
      setOpenDialog(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la place:", error);
    } finally {
      setLoading(false);
    }
  };

  // Modifier une place de parking
  const updatePlace = async () => {
    if (!editingPlace.numero) {
      alert("Le numéro de la place est obligatoire !");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${API_PLACE_PARKING}/${editingPlace.id}`, editingPlace);
      fetchPlaces(); // Actualiser les données après la modification
      setEditingPlace(null);
      setSuccessMessage("Place modifiée avec succès !");
      setOpenDialog(false);
    } catch (error) {
      console.error("Erreur lors de la modification de la place:", error);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une place de parking
  const deletePlace = async (id) => {
    try {
      await axios.delete(`${API_PLACE_PARKING}/${id}`);
      fetchPlaces(); // Actualiser les données après la suppression
    } catch (error) {
      console.error("Erreur lors de la suppression de la place:", error);
    }
  };

  // Ouvrir le formulaire en mode modification
  const openEditDialog = (place) => {
    setEditingPlace(place);
    setOpenDialog(true);
  };

  // Pagination: calculer les places à afficher
  const indexOfLastPlace = page * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = places.slice(indexOfFirstPlace, indexOfLastPlace);

  // Changer de page
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
        Gestion des Places de Parking
      </Typography>
      <Divider sx={{ width: "100%", my: 2 }} /> */}

      <Button
        variant="contained"
        color="success"
        onClick={() => {
          setEditingPlace(null);
          setOpenDialog(true);
        }}
      >
        + Ajouter une Place
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle textAlign="center">
          {editingPlace ? "Modifier une Place de Parking" : "Ajouter une Place de Parking"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              label="Numéro"
              name="numero"
              value={editingPlace ? editingPlace.numero : newPlace.numero}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />
            <Select
              name="etat"
              value={editingPlace ? editingPlace.etat : newPlace.etat}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            >
              <MenuItem value="VIDE">VIDE</MenuItem>
              <MenuItem value="OCCUPÉ">OCCUPÉ</MenuItem>
              <MenuItem value="RÉSERVÉ">RÉSERVÉ</MenuItem>
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={editingPlace ? updatePlace : addPlace}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Chargement..." : editingPlace ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {successMessage && (
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
        />
      )}

      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Numéro</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>État</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPlaces.map((place) => (
            <TableRow key={place.id}>
              <TableCell>{place.id}</TableCell>
              <TableCell>{place.numero}</TableCell>
              <TableCell>{place.etat}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => openEditDialog(place)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => deletePlace(place.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        count={Math.ceil(places.length / placesPerPage)}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />
    </Box>
  );
}

export default PlaceParking;
