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
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GroupApi from "../../Api/GroupApi";
import EtudiantApi from "../../Api/EtudiantApi";

function Etudiant() {
  const defaultEtudiant = { nom: "", prenom: "", email: "", motdepasse: "", groupeId: "" };
  const [etudiants, setEtudiants] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [newEtudiant, setNewEtudiant] = useState(defaultEtudiant);
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [dialogs, setDialogs] = useState({ add: false, edit: false, confirm: false });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [etudiantToDelete, setEtudiantToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [placesPerPage, setPlacesPerPage] = useState(5);

  // Fetch etudiants and groupes
  useEffect(() => {
    fetchEtudiants();
    fetchGroupes();
  }, []);

  const fetchEtudiants = async () => {
    try {
      const data = await EtudiantApi.fetchEtudiants();
      setEtudiants(data);
    } catch (error) {
      setErrorMessage("Erreur lors de la récupération des étudiants.");
    }
  };

  const fetchGroupes = async () => {
    try {
      const data = await GroupApi.fetchGroups();
      setGroupes(data);
    } catch (error) {
      setErrorMessage("Erreur lors de la récupération des groupes.");
    }
  };

  const getGroupName = (id) => {
    const groupe = groupes.find((g) => g.id === id);
    return groupe ? groupe.nom : "Non attribué";
  };

  const validateFields = () => {
    const { nom, prenom, email, motdepasse, groupeId } = newEtudiant;
    if (!nom || !prenom || !email || !motdepasse || !groupeId) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return false;
    }
    if (!email.endsWith("@emsi-edu.ma")) {
      setErrorMessage("L'email doit contenir '@emsi-edu.ma'.");
      return false;
    }
    return true;
  };

  const addEtudiant = async () => {
    if (!validateFields()) return;
  
    try {
      // Assurez-vous que les données sont envoyées dans le bon format
      const response = await EtudiantApi.createEtudiant(newEtudiant);
      setSuccessMessage("Étudiant ajouté avec succès !");
      // Vérification si la réponse est bien reçue
    
        setDialogs({ ...dialogs, add: false });
        setNewEtudiant(defaultEtudiant);
        fetchEtudiants(); // Rafraîchir la liste des étudiants    
    } catch (error) {
      // Afficher l'erreur complète pour le débogage
      setErrorMessage(error.response ? error.response.data.message : "Erreur inconnue lors de la création de l'étudiant.");
    }
  };
  
  

  const updateEtudiant = async () => {
    if (!validateFields()) return;
    try {
      await EtudiantApi.updateEtudiant(selectedEtudiant.id, newEtudiant);
      setSuccessMessage("Étudiant mis à jour avec succès !");
      setDialogs({ ...dialogs, edit: false });
      fetchEtudiants();
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour de l'étudiant.");
    }
  };

  const deleteEtudiant = async () => {
    try {
      await EtudiantApi.deleteEtudiant(etudiantToDelete.id);
      setSuccessMessage("Étudiant supprimé avec succès !");
      setDialogs({ ...dialogs, confirm: false });
      fetchEtudiants();
    } catch (error) {
      setErrorMessage("Erreur lors de la suppression de l'étudiant.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Button
        variant="contained"
        color="success"
        onClick={() => setDialogs({ ...dialogs, add: true })}
      >
        + Ajouter un étudiant
      </Button>

      {/* Dialog: Add/Edit Etudiant */}
      <Dialog
        open={dialogs.add || dialogs.edit}
        onClose={() => setDialogs({ ...dialogs, add: false, edit: false })}
      >
        <DialogTitle>
          {dialogs.edit ? "Modifier l'Étudiant" : "Ajouter un Étudiant"}
        </DialogTitle>
        <DialogContent>
          <TextField
          color="success"
            label="Nom"
            value={newEtudiant.nom}
            onChange={(e) => setNewEtudiant({ ...newEtudiant, nom: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
          color="success"
            label="Prénom"
            value={newEtudiant.prenom}
            onChange={(e) => setNewEtudiant({ ...newEtudiant, prenom: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
          color="success"
            label="Email"
            value={newEtudiant.email}
            onChange={(e) => setNewEtudiant({ ...newEtudiant, email: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
          color="success"
            label="Mot de Passe"
            type="password"
            value={newEtudiant.motdepasse}
            onChange={(e) => setNewEtudiant({ ...newEtudiant, motdepasse: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <Select
          color="success"
            value={newEtudiant.groupeId}
            onChange={(e) => setNewEtudiant({ ...newEtudiant, groupeId: e.target.value })}
            fullWidth
            margin="normal"
            required
          >
            {groupes.map((groupe) => (
              <MenuItem key={groupe.id} value={groupe.id}>
                {groupe.nom}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogs({ ...dialogs, add: false, edit: false })}
          color="black">
            Annuler
          </Button>
          <Button
            onClick={dialogs.edit ? updateEtudiant : addEtudiant}
            color="success"
            variant="contained"
          >
            {dialogs.edit ? "Mettre à Jour" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Confirm Delete */}
      <Dialog
        open={dialogs.confirm}
        onClose={() => setDialogs({ ...dialogs, confirm: false })}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer cet étudiant ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogs({ ...dialogs, confirm: false })}>Annuler</Button>
          <Button onClick={deleteEtudiant} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Nom</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Prénom</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Groupe</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {etudiants.slice((page - 1) * placesPerPage, page * placesPerPage).map((etudiant) => (
            <TableRow key={etudiant.id}>
              <TableCell>{etudiant.nom}</TableCell>
              <TableCell>{etudiant.prenom}</TableCell>
              <TableCell>{etudiant.email}</TableCell>
              <TableCell>{getGroupName(etudiant.groupeId)}</TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => {
                    setNewEtudiant(etudiant);
                    setSelectedEtudiant(etudiant);
                    setDialogs({ ...dialogs, edit: true });
                  }}
                  aria-label="Modifier"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    setEtudiantToDelete(etudiant);
                    setDialogs({ ...dialogs, confirm: true });
                  }}
                  aria-label="Supprimer"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(etudiants.length / placesPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        color="success"
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />

      {/* Snackbar Messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        color="error"
      />
    </Box>
  );
}

export default Etudiant;