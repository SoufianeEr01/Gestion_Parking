import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CircularProgress, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const Root = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5s pour simuler un chargement rapide
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{
              background: "#f0f4ff",
              color: "#green",
              textAlign: "center",
            }}
          >
            <CircularProgress
              size={70}
              thickness={4}
              sx={{ color: "green", marginBottom: "20px" }}
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Arial",
                fontWeight: "bold",
              }}
            >
              Chargement du Parking EMSI...
            </Typography>
          </Box>
        </motion.div>
      ) : (
        <App />
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);