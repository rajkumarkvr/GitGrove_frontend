import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Box,
  Button,
  ListItemIcon,
  ListItemButton,
  CssBaseline,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Back icon
import { AccountBox, Palette, Person, Key } from "@mui/icons-material";
const drawerWidth = 240;
const settingsMenu = [
  { text: "Profile", icon: <Person />, path: "profile-edit" },
  { text: "Account", icon: <AccountBox />, path: "account" },
  { text: "Theme", icon: <Palette />, path: "theme" },
  { text: "SSH key", icon: <Key />, path: "add-ssh-key" },
];

const SettingsLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Sidebar Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-start" }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={() => navigate("/repositories")}
            sx={{
              textTransform: "none", // Prevents all caps text
              padding: "4px 8px", // Reduces padding for a smaller size
              minWidth: "auto", // Keeps it compact
            }}
          >
            Back
          </Button>
        </Box>

        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            columnGap: 2,
            rowGap: 2,
          }}
        >
          {settingsMenu.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  "&.active": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: "4px",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, padding: 2, mr: 80 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default SettingsLayout;
