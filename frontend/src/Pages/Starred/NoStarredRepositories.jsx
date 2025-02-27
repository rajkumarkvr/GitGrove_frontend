import React from "react";
import { Box, Typography, useTheme, Container, Link } from "@mui/material";
import { motion } from "framer-motion";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useNavigate } from "react-router-dom";

const NoStarredRepositories = () => {
  const theme = useTheme();
  const navigate = useNavigate();

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
          <StarBorderIcon
            sx={{
              fontSize: 120,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.warning.light
                  : theme.palette.warning.main,
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
            You have not starred any repositories yet!
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
            Discover amazing projects and star your favorites to keep track of
            them.
          </Typography>
        </motion.div>

        {/* Creative Call-to-Action */}
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[200],
              padding: "10px 20px",
              borderRadius: "20px",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 2px 8px rgba(255, 255, 255, 0.05)"
                  : "0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Typography
              variant="body2"
              color={
                theme.palette.mode === "dark"
                  ? theme.palette.warning.light
                  : theme.palette.warning.main
              }
              fontWeight="medium"
            >
              Start exploring now!
            </Typography>
            <Link
              component="button"
              onClick={() => navigate("/explore")}
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                textDecoration: "underline",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "none",
                },
              }}
            >
              Browse Repositories
            </Link>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default NoStarredRepositories;
