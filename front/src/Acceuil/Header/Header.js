import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Container, Toolbar, IconButton, Box, useTheme, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { fetchUserData } from "./headerUtils";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import UserMenu from "./UserMenu";
import Logo from "./Logo";

const Header = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData(setUser, setLoading);
  }, []);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "rgb(0, 141, 54)", boxShadow: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo navigate={navigate} />
          
          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                aria-label="open menu"
                edge="start"
                onClick={handleMobileMenuToggle}
              >
                <MenuIcon />
              </IconButton>
              <MobileNav 
                open={mobileMenuOpen} 
                onClose={() => setMobileMenuOpen(false)}
                user={user}
                loading={loading}
              />
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
                <DesktopNav />
              </Box>
              <UserMenu user={user} loading={loading} />
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;