import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Snackbar,
  Typography,
  Pagination,
  Grid,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import ReservationApi from "../../Api/ReservationApi";
import SearchIcon from "@mui/icons-material/Search";
import { green } from "@mui/material/colors";

function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of reservations per page
  const [filterText, setFilterText] = useState(""); // Filter for name
  const [filterEtat, setFilterEtat] = useState(""); // Filter for status
  const [filterNumeroPlace, setFilterNumeroPlace] = useState(""); // Filter for number place
  const [filterDate, setFilterDate] = useState(""); // Filter for date
  const [filterHeureDebut, setFilterHeureDebut] = useState(""); // Filter for start time
  const [filterHeureFin, setFilterHeureFin] = useState(""); // Filter for end time

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
  }, [reservations]);

  // Handle filter change for name
  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
    setPage(1); // Reset to the first page when the filter changes
  };

  // Handle filter change for status
  const handleFilterEtatChange = (event) => {
    setFilterEtat(event.target.value);
    setPage(1); // Reset to the first page when the filter changes
  };

  // Handle filter change for numero place
  const handleFilterNumeroPlaceChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setFilterNumeroPlace(value);
    }
    setPage(1);
  };

  // Handle filter change for date
  const handleFilterDateChange = (event) => {
    setFilterDate(event.target.value);
    setPage(1); // Reset to the first page
  };

  // Handle filter change for start time
  // Handle filter change for start time
const handleFilterHeureDebutChange = (event) => {
  setFilterHeureDebut(event.target.value);
  setPage(1); // Reset to the first page
};


  // Handle filter change for end time
  const handleFilterHeureFinChange = (event) => {
    setFilterHeureFin(event.target.value);
    setPage(1); // Reset to the first page
  };

  const filteredReservations = reservations.filter((reservation) =>
    (reservation.nomPersonne.toLowerCase().includes(filterText.toLowerCase()) ||
      reservation.prenomPersonne.toLowerCase().includes(filterText.toLowerCase())) &&
    (filterEtat ? reservation.etatReservation.toLowerCase() === filterEtat.toLowerCase() : true) &&
    (filterNumeroPlace ? reservation.numeroPlace.toString().includes(filterNumeroPlace) : true) &&
    (filterDate ? reservation.dateReservation === filterDate : true) &&
    (filterHeureDebut ? reservation.heureDebut.startsWith(filterHeureDebut) : true) && // Compare start time
    (filterHeureFin ? reservation.heureFin.startsWith(filterHeureFin) : true) // Compare end time
  );

  const paginatedReservations = filteredReservations.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Filter section */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Filter by name */}
        <Grid item xs={4}>
          <TextField
            label="Filtrer par nom"
            variant="outlined"
            value={filterText}
            color="success"
            fullWidth
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="success" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
              "& .MuiInputLabel-root": {
                fontWeight: "bold",
              },
              "& .MuiOutlinedInput-input": {
                padding: "12px 14px",
                fontSize: "16px",
              },
            }}
          />
        </Grid>

        {/* Filter by status */}
        <Grid item xs={4}>
          <TextField
            select
            label="Filtrer par état"
            value={filterEtat}
            onChange={handleFilterEtatChange}
            fullWidth
            color="success"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="success" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
              "& .MuiInputLabel-root": {
                fontWeight: "bold",
              },
              "& .MuiOutlinedInput-input": {
                padding: "12px 14px",
                fontSize: "16px",
              },
            }}
            
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="actif">Actif</MenuItem>
            <MenuItem value="archive">Archive</MenuItem>
          </TextField>
        </Grid>

        {/* Filter by numero place */}
        <Grid item xs={4}>
          <TextField
            label="Filtrer par numéro de place"
            variant="outlined"
            value={filterNumeroPlace}
            color="success"
            fullWidth
            onChange={handleFilterNumeroPlaceChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="success" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
              "& .MuiInputLabel-root": {
                fontWeight: "bold",
              },
              "& .MuiOutlinedInput-input": {
                padding: "12px 14px",
                fontSize: "16px",
              },
            }}
          />
        </Grid>

        {/* Filter by date */}
        <Grid item xs={4}>
          <TextField
            label="Filtrer par date"
            variant="outlined"
            type="date"
            value={filterDate}
            color="success"
            fullWidth
            onChange={handleFilterDateChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="success" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
              "& .MuiInputLabel-root": {
                fontWeight: "bold",
              },
              "& .MuiOutlinedInput-input": {
                padding: "12px 14px",
                fontSize: "16px",
              },
            }}
          />
        </Grid>

        {/* Filter by start time */}
        <Grid item xs={4}>
          <TextField
            label="Filtrer par heure début"
            variant="outlined"
            type="time"
            value={filterHeureDebut}
            color="success"
            fullWidth
            onChange={handleFilterHeureDebutChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="success" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
              "& .MuiInputLabel-root": {
                fontWeight: "bold",
              },
              "& .MuiOutlinedInput-input": {
                padding: "12px 14px",
                fontSize: "16px",
              },
            }}
          />
        </Grid>

        {/* Filter by end time */}
        <Grid item xs={4}>
          <TextField
            label="Filtrer par heure fin"
            variant="outlined"
            type="time"
            value={filterHeureFin}
            color="success"
            fullWidth
            onChange={handleFilterHeureFinChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="success" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
              "& .MuiInputLabel-root": {
                fontWeight: "bold",
              },
              "& .MuiOutlinedInput-input": {
                padding: "12px 14px",
                fontSize: "16px",
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Display message if no reservations are found */}
      {filteredReservations.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 5 }}>
          Aucune réservation trouvée.
        </Typography>
      ) : (
        <>
          {/* Display table if there are reservations */}
          <Table sx={{ mt: 3.5, width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Heure Début</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Heure Fin</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Nom & Prénom</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Numéro du Place</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Lieu</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Etat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.dateReservation}</TableCell>
                  <TableCell>{reservation.heureDebut}</TableCell>
                  <TableCell>{reservation.heureFin}</TableCell>
                  <TableCell>
                    {reservation.nomPersonne} {reservation.prenomPersonne}
                  </TableCell>
                  <TableCell>{reservation.numeroPlace}</TableCell>
                  <TableCell>{reservation.lieuReservation}</TableCell>
                  <TableCell 
                          style={{ color: reservation.etatReservation === "actif" ? 'green' : 'primary' }}
                        >
                          {reservation.etatReservation}
                        </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

                {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredReservations.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        color="success"
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />
    </>
  )}

  {/* Success message */}
  <Snackbar
    open={!!successMessage}
    autoHideDuration={3000}
    onClose={() => setSuccessMessage("")}
    message={successMessage}
  />

  {/* Error message */}
  <Snackbar
    open={!!errorMessage}
    autoHideDuration={3000}
    onClose={() => setErrorMessage("")}
    message={errorMessage}
    sx={{ "& .MuiSnackbarContent-root": { backgroundColor: "red" } }}
  />
</Box>

  );
}

export default Reservation;
