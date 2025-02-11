import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import React, { createContext, useState, useMemo } from "react";

// Create a context
export const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children }) => {
  const savedTheme = localStorage.getItem("theme") === "dark";
  // State to manage the theme (light or dark)
  const [darkMode, setDarkMode] = useState(savedTheme);

  // Toggle function
  const toggleTheme = () => {
    setDarkMode((prevMode) => {
      let newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  // Create theme based on state
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
