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
  InputAdornment,
} from "@mui/material";
import ReservationApi from "../../Api/ReservationApi";
import SearchIcon from "@mui/icons-material/Search";

function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6); // Number of reservations per page
  const [filterText, setFilterText] = useState(""); // State for filter text

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

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
    setPage(1); // Reset to the first page when the filter changes
  };

  // Filter reservations based on the name
  const filteredReservations = reservations.filter((reservation) =>
    reservation.nomPersonne.toLowerCase().includes(filterText.toLowerCase()) ||
    reservation.prenomPersonne.toLowerCase().includes(filterText.toLowerCase())
  );

  // Slice the reservations for the current page
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
      {/* Filter TextField */}
      <TextField
        
        label="Filtrer par nom"
        variant="outlined"
        value={filterText}
        color="success"
        width="50%"
        onChange={handleFilterChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="success" />
            </InputAdornment>
          ),
        }}

        sx={{
          mb: 2,
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

      {/* Display message if no reservations are found */}
      {filteredReservations.length === 0 ? (
        <Typography
          variant="h6"
          align="center"
          color="textSecondary"
          sx={{ mt: 5 }}
        >
          Aucune réservation trouvée pour cet utilisateur.
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
                <TableCell style={{ fontWeight: "bold" }}>Groupe</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  Numéro du Place
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Lieu</TableCell>
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
                  <TableCell>{reservation.nomGroupe}</TableCell>
                  <TableCell>{reservation.numeroPlace}</TableCell>
                  <TableCell>{reservation.lieuReservation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={Math.ceil(filteredReservations.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="success"
              sx={{ mt: 2 }}
            />
          </Box>
        </>
      )}

      {/* Snackbar for success and error messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

export default Reservation;
