import { useState, useCallback } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { motion } from "framer-motion";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import useSound from "use-sound";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import lightSound from "/sounds/light-switch.mp3";
import darkSound from "/sounds/light-switch.mp3";

const ThemeSettings = ({ mode, toggleTheme }) => {
  const [playLight] = useSound(lightSound);
  const [playDark] = useSound(darkSound);
  const [key, setKey] = useState(0); // Force particles to reload on toggle

  // Handle Theme Toggle with Sound & Particle Reset
  const handleThemeToggle = () => {
    if (mode === "light") playDark();
    else playLight();

    toggleTheme();
    setKey((prevKey) => prevKey + 1); // Refresh particles to trigger new animation
  };

  // Particle Configurations
  const particlesOptions = {
    key: key,
    particles: {
      number: { value: 80 },
      size: { value: 3 },
      move: {
        enable: true,
        speed: 2,
        direction: mode === "light" ? "top" : "bottom",
        outMode: "out",
      },
      shape: { type: "circle" },
      color: { value: mode === "light" ? "#f1c40f" : "#ffffff" },
    },
  };

  return (
    <Paper
      elevation={10}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        p: 5,
        borderRadius: 4,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        bgcolor: mode === "light" ? "background.default" : "#121212",
        color: mode === "light" ? "black" : "white",
        transition: "background 0.6s ease-in-out, box-shadow 0.4s ease",
        boxShadow:
          mode === "light"
            ? "0px 0px 20px rgba(255, 223, 79, 0.8)"
            : "0px 0px 20px rgba(0, 255, 255, 0.6)",
      }}
    >
      {/* Background Particles */}
      <Particles options={particlesOptions} init={loadFull} />

      {/* Flash Effect on Toggle */}
      <motion.div
        key={key}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            mode === "light"
              ? "radial-gradient(circle, rgba(255,255,0,0.4) 10%, rgba(255,255,0,0) 70%)"
              : "radial-gradient(circle, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0) 70%)",
          zIndex: -1,
        }}
      />

      {/* Title Animation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {mode === "light" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </Typography>
      </motion.div>

      {/* Theme Toggle Button with Effects */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
      >
        <IconButton
          onClick={handleThemeToggle}
          sx={{
            color: mode === "light" ? "#f1c40f" : "#ffffff",
            fontSize: 50,
            transition: "color 0.3s ease-in-out, transform 0.3s ease-in-out",
            "&:hover": { transform: "scale(1.2) rotate(20deg)" },
          }}
        >
          {mode === "light" ? (
            <WbSunnyIcon fontSize="large" />
          ) : (
            <DarkModeIcon fontSize="large" />
          )}
        </IconButton>
      </motion.div>

      {/* Subtitle Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic" }}>
          Click the {mode === "light" ? "sun" : "moon"} to switch themes
        </Typography>
      </motion.div>

      {/* Rotating Borders */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: -20,
          left: -20,
          width: "120%",
          height: "120%",
          border: mode === "light" ? "5px solid #ffcc00" : "5px solid #00ffff",
          borderRadius: "50%",
          opacity: 0.3,
          zIndex: -2,
        }}
      />

      {/* Footer Glow Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
        style={{
          position: "absolute",
          bottom: -10,
          left: 0,
          width: "100%",
          height: "10px",
          background:
            mode === "light"
              ? "linear-gradient(to right, #ffcc00, #ff8800)"
              : "linear-gradient(to right, #0a0a0a, #333333)",
          boxShadow:
            mode === "light"
              ? "0px 0px 10px rgba(255, 223, 79, 0.6)"
              : "0px 0px 10px rgba(0, 255, 255, 0.6)",
        }}
      />
    </Paper>
  );
};

export default ThemeSettings;
