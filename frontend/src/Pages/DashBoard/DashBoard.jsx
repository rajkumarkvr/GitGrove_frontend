import { Outlet, NavLink, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  Typography,
  Switch,
} from "@mui/material";
import {
  Folder,
  Search,
  AddCircle,
  Star,
  GitHub,
  Settings,
  ListAlt,
  CompareArrows,
} from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import getCurrentUser from "../../Contexts/getCurrentUser";
import getToken from "../../CustomHooks/getAuthToken";

const drawerWidth = 240;
const dashBoardItems = [
  { text: "My Repositories", icon: <Folder />, path: "repositories" },
  { text: "Explore", icon: <Search />, path: "explore" },
  { text: "Create Repo", icon: <AddCircle />, path: "create-repo" },
  { text: "Starred", icon: <Star />, path: "starred" },
  { text: "Pull Requests", icon: <CompareArrows />, path: "pull-requests" },
  {
    text: "Profile & Settings",
    icon: <Settings />,
    path: "settings",
  },
];
const Dashboard = ({ toggleTheme }) => {
  const theme = useTheme();

  const currentUser = getCurrentUser();
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* App Bar */}
      {/* <AppBar
        color="info"
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6">GitGrove </Typography>
        </Toolbar>
         <Switch onChange={toggleTheme} /> 
      </AppBar> */}

      {/* Sidebar Drawer */}
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
        <Toolbar>
          <Box
            sx={{ display: "flex", flexGrow: 1, alignItems: "center", gap: 1 }}
          >
            <Link to="/">
              <img
                src="images/app_logo.png"
                alt="GitGrove"
                height="40"
                style={{ cursor: "pointer" }}
              />
            </Link>
            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
              GitGrove
            </Typography>
          </Box>
          <img
            src={currentUser?.profile_url}
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
        </Toolbar>
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            columnGap: 2,
            rowGap: 2,
          }}
        >
          {dashBoardItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  "&.active": {
                    backgroundColor: theme.palette.primary.main, // Highlight active link
                    color: theme.palette.primary.contrastText, // Change text color for contrast
                    borderRadius: "4px", // Optional: Smooth rounded edges
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit", // Ensure icon color changes too
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
