import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";

// Motion variants for smooth animations
const buttonVariant = {
  hover: { scale: 1.05, opacity: 0.9 },
  tap: { scale: 0.95 },
};

const BackLink = ({ to, label = "Back" }) => {
  return (
    <motion.div variants={buttonVariant} whileHover="hover" whileTap="tap">
      <Button
        component={Link}
        to={to}
        startIcon={<ArrowBackIcon />}
        sx={{
          margin: "20px",
          textTransform: "none",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#1976d2",
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: "8px",
          transition: "all 0.3s",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.1)",
          },
        }}
      >
        <Typography variant="body1">{label}</Typography>
      </Button>
    </motion.div>
  );
};

export default BackLink;
