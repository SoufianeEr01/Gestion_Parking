import React, { useState } from "react";
import { Avatar, Menu } from "@mui/material";
import UserMenuItems from "./UserMenuItems";

const UserMenu = ({ user, loading }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading || !user?.nom) return null;

  return (
    <>
      <Avatar 
        sx={{ 
          bgcolor: "rgb(255, 255, 255)",
          color: "black",
          cursor: "pointer"
        }} 
        onClick={handleProfileClick}
      >
        {user.nom?.charAt(0) || "?"}
      </Avatar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ mt: "8px" }}
      >
        <UserMenuItems onClose={handleClose} />
      </Menu>
    </>
  );
};

export default UserMenu;