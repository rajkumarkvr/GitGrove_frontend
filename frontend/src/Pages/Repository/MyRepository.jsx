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
  Skeleton,
  useTheme,
  Chip,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star"; // Imported Filled Star Icon
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import getCurrentUser from "../../Contexts/getCurrentUser";
import getFormattedDateTime from "../../CustomHooks/getFormattedDateTime";
import { FolderOpen } from "@mui/icons-material";
import CreateRepositoryButton from "./CreateRepositoryButton";
const MyRepositories = ({ api }) => {
  const [repositories, setRepositories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [starredRepos, setStarredRepos] = useState(new Set());
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const fetchRepos = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `${api}?username=${user.username}`
          );

          console.log(response.data);
          setRepositories(response.data.repositories);

          const starredSet = new Set(
            response.data.repositories
              .filter((repo) => repo.isStarred)
              .map((repo) => repo.id)
          );
          setStarredRepos(starredSet);
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

  const handleStarClick = async (repoId) => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/service/AddStarToRepository",
        null,
        {
          params: { username: user.username, repoid: repoId },
        }
      );
      console.log(response);
      if (response.status === 200) {
        setStarredRepos((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(repoId)) {
            newSet.delete(repoId); // Remove if already starred
          } else {
            newSet.add(repoId); // Add if not starred
          }
          return newSet;
        });

        // Update repository stars count
        setRepositories((prevRepos) =>
          prevRepos.map((repo) =>
            repo.id === repoId
              ? {
                  ...repo,
                  stars: starredRepos.has(repoId)
                    ? repo.stars - 1
                    : repo.stars + 1,
                }
              : repo
          )
        );
      }
    } catch (error) {
      console.error("Error updating star:", error);
    }
  };
  if (repositories == null || repositories.length == 0) {
    return (
      <Typography variant="h6" textAlign="center" color="text.secondary">
        No repositories found.
      </Typography>
    );
  }
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
        sx={{ top: 0, left: 0, right: 0, zIndex: 1000, boxShadow: 2 }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-around", ml: "80px" }}
        >
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
                <MenuItem value="stars">Ratings</MenuItem>
              </Select>
            </FormControl>
            <CreateRepositoryButton text={"New"} />
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          mt: 12,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: 5,
        }}
      >
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={150} />
          ))
        ) : filteredRepos.length > 0 ? (
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
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/repo/${repo.ownername}/${repo.name}`);
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
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      {repo.ownername}/{repo.name}
                    </Typography>
                    <Chip
                      label={repo.visibility}
                      variant="outlined"
                      color={repo.visibility === "PUBLIC" ? "info" : "success"}
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        borderRadius: 1,
                        fontSize: "0.60rem",
                        borderColor:
                          repo.visibility === "PUBLIC"
                            ? "primary.light"
                            : "success.light",
                        backgroundColor: "transparent",
                      }}
                    />
                    {/* <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                      <MoreVertIcon />
                    </IconButton> */}
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {repo.description || "No description available"}
                  </Typography>

                  <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
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
                    <IconButton
                      component={Link}
                      to={`/repo/${repo.ownername}/${repo.name}`}
                    >
                      <FolderOpen color="primary" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Star Repository">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStarClick(repo.id);
                      }}
                    >
                      {starredRepos.has(repo.id) ? (
                        <StarIcon color="warning" />
                      ) : (
                        <StarBorderIcon />
                      )}
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
            No repositories found
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default MyRepositories;
