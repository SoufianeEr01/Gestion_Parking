import React, { useState } from "react";
import { MenuItem, Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccountCircle, Logout } from "@mui/icons-material";
import ProfilePageUti from "../ProfilUti";

const UserMenuItems = ({ onClose, isMobile }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
    onClose();
  };

  const handleProfileClick = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <MenuItem onClick={handleProfileClick}>
        <AccountCircle sx={{ mr: 1 }} />
        Mon profil
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
        <ProfilePageUti 
          onClose={() => setOpenDialog(false)} 
          etudiant={JSON.parse(sessionStorage.getItem("userData"))}
        />
      </Dialog>
    </>
  );
};

export default UserMenuItems;