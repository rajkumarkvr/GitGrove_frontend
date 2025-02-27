import { AppBar, Avatar, Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import getCurrentUser from "../Contexts/getCurrentUser";

export const MainNavBar = () => {
  const currentUser = getCurrentUser();
  const theme = useTheme();
  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{ top: 0, left: 0, right: 0, zIndex: 1100, boxShadow: 2 }}
    >
      {/* <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
        <Stack direction="row" spacing={20} alignItems="center">
          <TextField
            label="Search Repositories"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormControl size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
              sx={{ minWidth: 250 }}
            >
              <MenuItem value="updated">Last Updated</MenuItem>
              <MenuItem value="stars">Stars</MenuItem>
            </Select>
          </FormControl>
          <CreateRepositoryButton />
        </Stack>
      </Toolbar> */}
      <Link to="/settings/profile-edit" style={{ textDecoration: "none" }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
            position: "fixed",
            right: 25,
            p: 0.8,
            mt: 1,
            borderRadius: "8px",
            bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.100",
            color: theme.palette.mode === "dark" ? "white" : "black",
            transition: "background 0.3s ease-in-out",
            "&:hover": {
              bgcolor: theme.palette.mode === "dark" ? "grey.700" : "grey.200",
            },
          }}
        >
          <Avatar src={currentUser?.profile_url} />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: theme.palette.mode === "dark" ? "white" : "black",
            }}
          >
            {currentUser?.username}
          </Typography>
        </Box>
      </Link>
    </AppBar>
  );
};

export default MainNavBar;
