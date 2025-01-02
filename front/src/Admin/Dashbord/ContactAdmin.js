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
  Snackbar,
  Pagination,
} from "@mui/material";
import ContactApi from "../../Api/ContactApi";
import ReponseApi from "../../Api/ReponseApi";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]); 
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState({ success: "", error: "" });
  const [page, setPage] = useState(1);
  const contactsPerPage = 5;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const contactData = await ContactApi.fetchContacts();
      const updatedContacts = await Promise.all(
        contactData.map(async (contact) => {
          const reponse = await fetchReponseByContactId(contact.id);
          return {
            ...contact,
            reponse: reponse || "Non répondu",
          };
        })
      );
      setContacts(updatedContacts);
    } catch (error) {
      setFeedbackMessage({ success: "", error: "Erreur lors de la récupération des contacts." });
    }
  };

  const fetchReponseByContactId = async (contactId) => {
    try {
      const response = await ReponseApi.fetchReponsesByContactId(contactId);
      return response || ""; 
    } catch {
      return ""; 
    }
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      setFeedbackMessage({ success: "", error: "Le texte de la réponse ne peut pas être vide." });
      return;
    }

    try {
      const payload = {
        contactId: selectedContact.id,
        text: responseText, // Respecte la clé attendue
      };

      await ReponseApi.createReponse(selectedContact.id, payload);
      setFeedbackMessage({ success: "Réponse envoyée avec succès!", error: "" });
      setResponseText("");
      setOpenDialog(false);

      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === selectedContact.id
            ? { ...contact, reponse: responseText }
            : contact
        )
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse:", error.response?.data || error.message);
      setFeedbackMessage({
        success: "",
        error: error.response?.data?.title || "Erreur lors de l'envoi de la réponse.",
      });
    }
  };

  const indexOfLastContact = page * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold",textAlign: 'center' }}>
        Gestion des Contacts && Reponse
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Nom</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Message</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Réponse</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.nom}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.message}</TableCell>
              <TableCell>{contact.reponse}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="success"
                  disabled={contact.reponse !== "Non répondu"}
                  onClick={() => {
                    setSelectedContact(contact);
                    setOpenDialog(true);
                  }}
                >
                  Répondre
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination color="success"
          count={Math.ceil(contacts.length / contactsPerPage)}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
        />
      </Box>

      

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>

        <DialogTitle style={{textAlign:'center'}} >Répondre à {selectedContact?.nom}</DialogTitle>

        <DialogContent >
          <TextField
          style={{marginTop:'10px'}}
            label="Votre réponse"
            variant="outlined"
            color="success"
            multiline
            fullWidth
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="black">
            Annuler
          </Button>
          <Button onClick={handleSubmitResponse} color="success" variant="contained">
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!feedbackMessage.success || !!feedbackMessage.error}
        autoHideDuration={4000}
        onClose={() => setFeedbackMessage({ success: "", error: "" })}
        message={feedbackMessage.success || feedbackMessage.error}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Box>
  );
};

export default ContactManagement;
