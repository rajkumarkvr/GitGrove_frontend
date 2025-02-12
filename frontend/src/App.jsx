// import { Button, Box, Typography } from "@mui/material";
import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/DashBoard/DashBoard";
import SettingsLayout from "./Pages/Settings/SettingsLayout/SettingsLayout";
import ThemeSettings from "./Pages/Settings/Theme/ThemeSettings";
import ProfileSettings from "./Pages/Settings/ProfileSettings/ProfileSettings";
import AccountSettings from "./Pages/Settings/AccountSettings/AccountSettings";
import CreateRepo from "./Pages/CreateRepo/CreateRepo";
// import HomeIcon from "@mui/icons-material/Home";
//1 unit = 8px by default in MUI

function App() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/repositories" replace />} />
        <Route path="/" element={<Dashboard toggleTheme={toggleTheme} />}>
          <Route index path="repositories" element={<h1>Repos</h1>} />
          <Route path="explore" element={<h1>Explore</h1>} />
          <Route path="create-repo" element={<CreateRepo />} />
          <Route path="starred" element={<h1>Starred</h1>} />
          <Route path="pull-requests" element={<h1>Pull Requets</h1>} />
          <Route path="profile" element={<h1>Profile</h1>} />
          {/* Nested Settings Route */}
          <Route
            path="/settings"
            element={<Navigate to="/settings/profile-edit" replace />}
          />
          <Route path="settings" element={<SettingsLayout />}>
            <Route
              path="theme"
              element={
                <ThemeSettings toggleTheme={toggleTheme} mode={darkMode} />
              }
            />
            <Route path="profile-edit" element={<ProfileSettings />} />
            <Route path="account" element={<AccountSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;

// <Box sx={{ textAlign: "center", mt: 5 }}>
// <HomeIcon sx={{ fontSize: { xs: 20, sm: 30, md: 40, lg: 50 } }} />
// <Typography variant="h1">Hello, World!</Typography>
// <Typography variant="h6">
//   Current Theme: {darkMode ? "Dark" : "Light"}
// </Typography>
// <Button
//   variant="contained"
//   color="primary"
//   onClick={toggleTheme}
//   sx={{ mt: 2 }}
// >
//   Toggle Theme
// </Button>
// </Box>
