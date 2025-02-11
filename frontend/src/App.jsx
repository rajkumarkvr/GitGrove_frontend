import { Button, Box, Typography } from "@mui/material";
import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";
import HomeIcon from "@mui/icons-material/Home";
//1 unit = 8px by default in MUI

function App() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <>
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <HomeIcon sx={{ fontSize: { xs: 20, sm: 30, md: 40, lg: 50 } }} />
        <Typography variant="h1">Hello, World!</Typography>
        <Typography variant="h6">
          Current Theme: {darkMode ? "Dark" : "Light"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleTheme}
          sx={{ mt: 2 }}
        >
          Toggle Theme
        </Button>
      </Box>
    </>
  );
}

export default App;
