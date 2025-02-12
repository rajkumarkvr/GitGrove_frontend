import { Box, Typography } from "@mui/material";
import ThemeToggle from "./ThemeToggle";

const ThemeSettings = ({ mode, toggleTheme }) => {
  return (
    <Box>
      <Typography variant="h6">Theme Settings</Typography>
      <ThemeToggle mode={mode} toggleTheme={toggleTheme} />
    </Box>
  );
};

export default ThemeSettings;
