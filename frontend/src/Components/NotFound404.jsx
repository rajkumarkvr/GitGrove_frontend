import React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  Container,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub"; // Placeholder for Git theme
import BrokenImageIcon from "@mui/icons-material/BrokenImage"; // Placeholder for "broken" theme
import { useNavigate } from "react-router-dom";

const NotFound404 = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const vectorVariants = {
    animate: {
      scale: [1, 1.1, 1], // Pulse effect
      rotate: [0, 5, -5, 0], // Slight wobble
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Bounce animation for the button
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    animate: {
      y: [0, -10, 0], // Bounce up and down
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Container maxWidth="md">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: theme.spacing(4),
          borderRadius: "16px",
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[50],
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 20px rgba(255, 255, 255, 0.1)"
              : "0 8px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <motion.div variants={vectorVariants} animate="animate">
          <Box
            sx={{
              position: "relative",
              width: "150px",
              height: "150px",
              mb: 4,
            }}
          >
            <img
              src="/images/Gitgrove.svg"
              alt="Git Grove"
              sx={{
                width: "100%",
                height: "100%",
              }}

              //   sx={{
              //     fontSize: 120,
              //     color:
              //       theme.palette.mode === "dark"
              //         ? theme.palette.grey[400]
              //         : theme.palette.grey[700],
              //     position: "absolute",
              //     top: "50%",
              //     left: "50%",
              //     transform: "translate(-50%, -50%)",
              //   }}
            />
            {/* <GitHubIcon
              sx={{
                fontSize: 120,
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[400]
                    : theme.palette.grey[700],
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            /> */}
            {/* <BrokenImageIcon
              sx={{
                fontSize: 60,
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.error.light
                    : theme.palette.error.main,
                position: "absolute",
                top: "70%",
                left: "70%",
                transform: "translate(-50%, -50%) rotate(15deg)",
              }}
            /> */}
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Typography
            variant="h1"
            fontWeight="bold"
            color={
              theme.palette.mode === "dark"
                ? theme.palette.error.light
                : theme.palette.error.main
            }
            sx={{ fontSize: { xs: "3rem", md: "5rem" }, mb: 2 }}
          >
            404
          </Typography>
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
            Oops! Lost in the Gitgrove!
          </Typography>
          <Typography
            variant="body1"
            color={
              theme.palette.mode === "dark"
                ? theme.palette.grey[400]
                : theme.palette.grey[600]
            }
            sx={{ mb: 4, maxWidth: "500px" }}
          >
            It seems we couldn’t find that page.
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/repositories")}
            sx={{
              padding: "12px 24px",
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: "bold",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.dark
                  : theme.palette.primary.main,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.main
                    : theme.palette.primary.dark,
              },
            }}
            component={motion.button}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            animate="animate"
          >
            Back to Gitgrove Home
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default NotFound404;
