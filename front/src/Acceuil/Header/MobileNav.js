import React from "react";
import { Drawer, List, ListItem, ListItemText, Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { navigationLinks } from "./headerUtils";
import UserMenuItems from "./UserMenuItems";

const MobileNav = ({ open, onClose, user, loading }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 250, pt: 2 }}>
        <List>
          {navigationLinks.map((page) => (
            <ListItem 
              button 
              key={page.id} 
              onClick={() => handleNavigation(page.path)}
            >
              <ListItemText 
                primary={page.name} 
                sx={{ 
                  "& .MuiTypography-root": { 
                    fontWeight: 600 
                  } 
                }}
              />
            </ListItem>
          ))}
        </List>
        {!loading && user?.nom && (
          <>
            <Divider />
            <UserMenuItems onClose={onClose} isMobile />
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default MobileNav;