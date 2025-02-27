import React from "react";
import { Box, Typography, useTheme, Container } from "@mui/material";
import { motion } from "framer-motion";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CreateRepositoryButton from "../CreateRepositoryButton";

const NoRepositoriesFound = () => {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          textAlign: "center",
          padding: theme.spacing(4),
          borderRadius: "12px",
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[100],
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 12px rgba(255, 255, 255, 0.1)"
              : "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Vector Image (Placeholder) */}
        <motion.div variants={itemVariants}>
          <FolderOpenIcon
            sx={{
              fontSize: 120,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[400]
                  : theme.palette.grey[600],
              mb: 2,
            }}
          />
        </motion.div>

        {/* Message */}
        <motion.div variants={itemVariants}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color={
              theme.palette.mode === "dark"
                ? theme.palette.text.primary
                : theme.palette.text.secondary
            }
            sx={{ mb: 2 }}
          >
            No repositories found
          </Typography>
          <Typography
            variant="body1"
            color={
              theme.palette.mode === "dark"
                ? theme.palette.grey[400]
                : theme.palette.grey[600]
            }
            sx={{ mb: 4 }}
          >
            It looks like there are no repositories to display. Start by
            creating one!
          </Typography>
        </motion.div>

        {/* Create Repository Button */}
        <motion.div variants={itemVariants}>
          <CreateRepositoryButton text="Create Repository" />
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default NoRepositoriesFound;
