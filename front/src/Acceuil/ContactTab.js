import React, { useEffect, useState } from "react"; 
import { Box, Typography, CircularProgress, Alert, Paper } from "@mui/material";
import ContactApi from "../Api/ContactApi";
import ReponseApi from "../Api/ReponseApi";

const ContactTab = ({ userEmail }) => {
  const [contacts, setContacts] = useState([]); // Contacts avec réponses
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs

  useEffect(() => {
    const fetchContacts = async () => {
      // Vérifie si l'email utilisateur est fourni
      if (!userEmail) {
        setError("Email utilisateur non fourni.");
        setLoading(false);
        return;
      }

      try {
        // Récupère tous les contacts
        const allContacts = await ContactApi.fetchContacts();
        console.log("Tous les contacts récupérés :", allContacts);

        // Filtre les contacts de l'utilisateur par email
        const userContacts = allContacts.filter(contact => contact.email === userEmail);
        console.log("Contacts de l'utilisateur :", userContacts);

        // Si aucun contact trouvé, mettre à jour l'état
        if (userContacts.length === 0) {
          setContacts([]);
          setLoading(false);
          return;
        }

        // Récupère les réponses associées aux contacts
        const contactsWithResponses = await Promise.all(
          userContacts.map(async (contact) => {
            try {
              const responseMessage = await ReponseApi.fetchReponsesByContactId(contact.id);
              console.log(`Réponse pour le contact ${contact.id} :`, responseMessage);
              return { ...contact, responseMessage: responseMessage || "Aucune réponse pour l'instant." };
            } catch (error) {
              console.error(`Erreur pour le contact ${contact.id} :`, error);
              return { ...contact, responseMessage: "Erreur lors de la récupération de la réponse." };
            }
          })
        );

        setContacts(contactsWithResponses);
      } catch (err) {
        console.error("Erreur lors de la récupération des contacts :", err);
        setError("Erreur lors de la récupération des contacts.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [userEmail]);

  // Affichage en fonction de l'état
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (contacts.length === 0) return <Typography>Aucun contact trouvé.</Typography>;

  return (
    <Box>
      {contacts.map((contact) => (
        <Paper
          key={contact.id}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            maxWidth: 600,
          }}
        >
          <Typography variant="h6">{contact.sujet}</Typography>
          <Typography variant="body2" color="text.secondary">
            {contact.message || "Message introuvable."}
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "bold" }}>
            Réponse de l'Admin :
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {contact.responseMessage || "Aucune réponse fournie."}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default ContactTab;
