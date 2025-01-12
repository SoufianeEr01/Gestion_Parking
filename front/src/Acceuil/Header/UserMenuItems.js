import React, { useState } from "react";
import { MenuItem, Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccountCircle, Logout } from "@mui/icons-material";
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import ProfilePageUti from "../ProfilUti";
import ReservationEffect from "../ReservationEffect";

const UserMenuItems = ({ onClose }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
    onClose();
  };

  const handleProfileClick = () => {
    setDialogContent(
      <ProfilePageUti 
        onClose={() => setOpenDialog(false)} 
        etudiant={JSON.parse(sessionStorage.getItem("userData"))} 
      />
    );
    setOpenDialog(true);
  };

  const handleReservationClick = () => {
    setDialogContent(
      <ReservationEffect 
        onClose={() => setOpenDialog(false)} 
        personne={JSON.parse(sessionStorage.getItem("userData"))} 
      />
    );
    setOpenDialog(true);
  };

  return (
    <>
      <MenuItem onClick={handleProfileClick}>
        <AccountCircle sx={{ mr: 1 }} />
        Mon profil
      </MenuItem>
      <MenuItem onClick={handleReservationClick}>
        <BookmarkAddedIcon sx={{ mr: 1 }} />
        Mes réservations
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <Logout sx={{ mr: 1 }} />
        Déconnexion
      </MenuItem>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        {dialogContent}
      </Dialog>
    </>
  );
};

export default UserMenuItems;
