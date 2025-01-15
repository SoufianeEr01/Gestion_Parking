import React, { useState, useEffect, useMemo } from "react";
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
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaceParkingApi from "../../Api/PlaceParkingApi";

const PlaceParking = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [openDialog, setOpenDialog] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ success: "", error: "" });
  const [page, setPage] = useState(1);
  const placesPerPage = 5;
  const [placeToDelete, setPlaceToDelete] = useState(null);
  const [placeData, setPlaceData] = useState({ numero: "", etage: "" });
  const [filterEtat, setFilterEtat] = useState("");

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const data = await PlaceParkingApi.fetchPlaceParkings();
      setPlaces(data);
    } catch (error) {
      setFeedbackMessage({ success: "", error: "Erreur lors de la récupération des places." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlaceData((prevData) => ({ ...prevData, [name]: String(value) }));
  };

  const handleFilterChange = (e) => {
    setFilterEtat(e.target.value);
    setPage(1); // Réinitialiser à la première page
  };

  const handleSubmit = async () => {
    const { numero, etage } = placeData;

    if (!String(numero).trim() || etage === "") {
      setFeedbackMessage({ success: "", error: "Tous les champs sont obligatoires !" });
      return;
    }

    try {
      await PlaceParkingApi.createPlaceParking({ numero, etage, etat: "libre" });
      setFeedbackMessage({ success: "Place ajoutée avec succès !", error: "" });
      setOpenDialog(false);
      setPlaceData({ numero: "", etage: "" });
      fetchPlaces();
    } catch {
      setFeedbackMessage({ success: "", error: "Erreur lors de l'opération." });
    }
  };

  const handleDelete = (place) => {
    setPlaceToDelete(place);
  };

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
    setPlaceToDelete(null);
  };

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => (filterEtat ? place.etat === filterEtat : true));
  }, [places, filterEtat]);

  const currentPlaces = useMemo(() => {
    const indexOfLastPlace = page * placesPerPage;
    const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
    return filteredPlaces.slice(indexOfFirstPlace, indexOfLastPlace);
  }, [filteredPlaces, page]);

  const getEtageLabel = (etage) => {
    switch (etage) {
      case 0:
        return "Rez-de-chaussée";
      case 1:
        return "Étage 1";
      case 2:
        return "Étage 2";
      default:
        return `Étage ${etage}`;
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="contained" color="success" onClick={() => setOpenDialog(true)}>
        + Ajouter une Place
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle textAlign="center">Ajouter une Place</DialogTitle>
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
            <InputLabel>Étage</InputLabel>
            <Select
              color="success"
              name="etage"
              value={placeData.etage}
              onChange={handleChange}
              label="Étage"
            >
              <MenuItem value="0">Rez-de-chaussée</MenuItem>
              <MenuItem value="1">Étage 1</MenuItem>
              <MenuItem value="2">Étage 2</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="success" variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!(feedbackMessage.success || feedbackMessage.error)}
        autoHideDuration={6000}
        onClose={() => setFeedbackMessage({ success: "", error: "" })}
        message={feedbackMessage.success || feedbackMessage.error}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Typography variant="h6">Liste des Places</Typography>
        <FormControl sx={{ width: 200 }}>
          <InputLabel style={{ color: "green" }}>Filtrer par état</InputLabel>
          <Select
            value={filterEtat}
            onChange={handleFilterChange}
            label="Filtrer par état"
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="libre">Libre</MenuItem>
            <MenuItem value="occupe">Occupé</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Table sx={{ mt: 2 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Numéro</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Étage</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Date Fin Réservation</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Nom</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Prenom</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>État</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPlaces.length > 0 ? (
              currentPlaces.map((place) => (
                <TableRow key={place.id}>
                  <TableCell>{place.numero}</TableCell>
                  <TableCell>{getEtageLabel(place.etage)}</TableCell>
                  <TableCell>{place.dateFinReservation || "--------"}</TableCell>
                  <TableCell>{place.nom || "--------"}</TableCell>
                  <TableCell>{place.prenom || "--------"}</TableCell>
                  <TableCell>{place.etat}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(place)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Aucun résultat trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredPlaces.length / placesPerPage)}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
          color="success"
        />
      </Box>

      <Dialog open={!!placeToDelete} onClose={() => setPlaceToDelete(null)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cette place ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlaceToDelete(null)} color="inherit">
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
