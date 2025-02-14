import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Stack,
  AppBar,
  Toolbar,
  Menu,
  MenuItem as MuiMenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import getCurrentUser from "../../Contexts/getCurrentUser";
import Loading from "../../Components/Loading";

function getFormattedDateTime(timestamp) {
  const date = new Date(timestamp + "Z"); // Ensure UTC interpretation
  date.setHours(date.getHours() - 5);
  date.setMinutes(date.getMinutes() - 30);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

const MyRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [loading, setLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    setLoading(true);
    const user = getCurrentUser();
    if (user) {
      const fetchRepos = async () => {
        try {
          const response = await axiosInstance.get(
            `/getAllRepositories?username=${user.username}`
          );
          setRepositories(response.data.repositories);
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };
      fetchRepos();
    } else {
      navigate("/login");
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleMenuOpen = (event, repo) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRepo(repo);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRepo(null);
  };

  const handleDelete = () => {
    console.log(`Deleting repository: ${selectedRepo.name}`);
    handleMenuClose();
  };

  const handleStarUpdate = (repoName) => {
    const updateStar = async () => {
      try {
        const response = await axiosInstance.put(`/starRepository`, {
          username: getCurrentUser().username,
          repoName: repoName,
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    updateStar();
  };

  const filteredRepos = repositories
    .filter((repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "stars"
        ? b.stars - a.stars
        : new Date(b.updated) - new Date(a.updated)
    );

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <AppBar
        position="fixed"
        color="default"
        sx={{ top: 0, left: 0, right: 0, zIndex: 1100, boxShadow: 2 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
          <Typography variant="h5" fontWeight="bold">
            My Repositories
          </Typography>
          <Stack direction="row" spacing={20} alignItems="center">
            <TextField
              label="Search Repositories"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FormControl size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
                sx={{
                  minWidth: 250,
                }}
              >
                <MenuItem value="updated">Last Updated</MenuItem>
                <MenuItem value="stars">Stars</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Toolbar>
      </AppBar>

      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            mt: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: 5,
          }}
        >
          {filteredRepos.length > 0 ? (
            filteredRepos.map((repo) => (
              <motion.div
                key={repo.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  sx={{
                    p: 2,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      rowGap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {repo.name}
                      </Typography>
                      <IconButton onClick={(e) => handleMenuOpen(e, repo)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {repo.description || "No description available."}
                    </Typography>

                    <Box
                      sx={{ mt: 2, display: "flex", flexDirection: "column" }}
                    >
                      <Typography variant="caption" fontWeight="bold">
                        Last Updated:
                      </Typography>
                      <Typography variant="body2">
                        {getFormattedDateTime(repo.updated)}
                      </Typography>

                      <Typography
                        variant="caption"
                        fontWeight="bold"
                        sx={{ mt: 1 }}
                      >
                        Created At:
                      </Typography>
                      <Typography variant="body2">
                        {getFormattedDateTime(repo.created_at)}
                      </Typography>
                    </Box>
                  </CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                    }}
                  >
                    <Tooltip title="View Repository">
                      <IconButton component={Link} to={`/repo/${repo.name}`}>
                        <VisibilityIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Star Count">
                      <IconButton>
                        <StarBorderIcon
                          onClick={() => {
                            handleStarUpdate(repo.name);
                          }}
                        />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {repo.stars}
                        </Typography>
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Card>
              </motion.div>
            ))
          ) : (
            <Typography variant="h6" textAlign="center" color="text.secondary">
              No repositories found.
            </Typography>
          )}
        </Box>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MuiMenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1, color: "red" }} />
          Delete
        </MuiMenuItem>
      </Menu>
    </Container>
  );
};

export default MyRepositories;
