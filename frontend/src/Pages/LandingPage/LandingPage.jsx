import { Box, Button, Typography, Grid, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Parallax } from "react-scroll-parallax";
import { useEffect, useState } from "react";

import GitGroveLogoDark from "/images/Logotextdownprimary.svg";
import GitGroveLogoWhite from "/images/Logotextdownwhite.svg";

import GitSpinnerDark from "/images/GitgroveBlack.svg";
import GitSpinnerLight from "/images/GitgroveWhite.svg";

const features = [
  {
    title: "Version Control",
    description: "Push, Pull, Clone seamlessly.",
    icon: "🚀",
  },
  {
    title: "Collaborate Easily",
    description: "Team up with members instantly.",
    icon: "👥",
  },
  {
    title: "Track Changes",
    description: "Monitor and revert edits smoothly.",
    icon: "🔄",
  },
  {
    title: "Secure Repositories",
    description: "Keep your code safe and accessible.",
    icon: "🔐",
  },
  {
    title: "Intuitive UI",
    description: "Simple yet powerful interface.",
    icon: "✨",
  },
];

const LandingPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const initialLogo = isDarkMode ? GitGroveLogoWhite : GitGroveLogoDark;
  const spinnerLogo = isDarkMode ? GitSpinnerLight : GitSpinnerDark;

  const [currentLogo, setCurrentLogo] = useState(initialLogo);
  const [showSpinner, setShowSpinner] = useState(false);
  const [randomStart, setRandomStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const randomX = Math.random() * window.innerWidth - 100;
    const randomY = Math.random() * window.innerHeight - 100;
    setRandomStart({ x: randomX, y: randomY });

    const timer = setTimeout(() => {
      setShowSpinner(true);
      setCurrentLogo(spinnerLogo);
    }, 3000);

    return () => clearTimeout(timer);
  }, [spinnerLogo]);

  return (
    <Box
      sx={{
        overflowX: "hidden",
        textAlign: "center",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 10,
          position: "relative",
        }}
      >
        <AnimatePresence>
          {!showSpinner ? (
            <motion.img
              key="static-logo"
              src={currentLogo}
              alt="GitGrove Logo"
              height="200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          ) : (
            <motion.img
              key="spinner-logo"
              src={currentLogo}
              alt="GitGrove Spinner"
              height="100"
              initial={{
                x: randomStart.x,
                y: randomStart.y,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="spin-delay"
            />
          )}
        </AnimatePresence>

        <Typography variant="h3" fontWeight="bold" mt={2}>
          Code, track, and never look back!
        </Typography>
        <Typography variant="h6" color="text.secondary" mt={1}>
          GitGrove: Because Committing Here is Easy!
        </Typography>
        <Box mt={3}>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{ mx: 2 }}
          >
            Get Started
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{ mx: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>

      <Parallax speed={-10}>
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold">
            Why GitGrove?
          </Typography>
          <Grid container spacing={4} justifyContent="center" mt={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: theme.shadows[3],
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Typography variant="h5">
                    {feature.icon} {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Parallax>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
            .spin-delay {
  animation: spin 4s linear infinite;
  animation-delay: 2.30s;
  transform-origin: center; 
  display: block; 
  margin: auto;
}
}

        `}
      </style>
    </Box>
  );
};

export default LandingPage;
