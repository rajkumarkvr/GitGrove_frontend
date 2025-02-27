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
  Avatar,
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
import MainNavBar from "../../Components/MainNavBar";
// import LogoTextLight from "/images/logotext/Logo text Primary.svg";
// import LogoTextDark from "/images/logotext/Logo text Dark.svg";
const drawerWidth = 240;
const dashBoardItems = [
  { text: "My Repositories", icon: <Folder />, path: "repositories" },
  { text: "Explore", icon: <Search />, path: "explore" },
  { text: "Create Repo", icon: <AddCircle />, path: "create-repo" },
  { text: "Starred", icon: <Star />, path: "starred" },

  {
    text: "Profile & Settings",
    icon: <Settings />,
    path: "settings",
  },
];
const Dashboard = ({ toggleTheme }) => {
  const theme = useTheme();
  // const logoSrc =
  //   theme.palette.mode === "dark"
  //     ? "/images/logotext/LogoTextPrimary.svg"
  //     : "/images/logotext/LogoTextDark.svg";
  // const logoSrc =
  //   theme.palette.mode === "dark"
  //     ? "/images/logotext/LogoTextWhite.svg"
  //     : "/images/logotext/LogoTextDark.svg";

  // const logoSrc =
  //   theme.palette.mode === "dark"
  //     ? "/images/logotext/LogoTextFullWhite.svg"
  //     : "/images/logotext/LogoTextFullBlack.svg";

  const logoSrc =
    theme.palette.mode === "dark"
      ? "/images/logotext/LogoTextPrimary.svg"
      : "/images/logotext/LogoTextDark.svg";
  // const currentUser = getCurrentUser();
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
      <MainNavBar />
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
                src={logoSrc}
                alt="GitGrove"
                height="30"
                style={{ cursor: "pointer" }}
              />
            </Link>
          </Box>
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
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: "4px",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
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

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
