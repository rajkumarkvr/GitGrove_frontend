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
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import getCurrentUser from "../../Contexts/getCurrentUser";
import Loading from "../../Components/Loading";
const dummyStarredRepos = [
  {
    id: 1,
    name: "nextjs-ecommerce",
    description:
      "A modern e-commerce platform built with Next.js and Tailwind CSS.",
    stars: 230,
    updated: "2024-02-10T14:30:00",
    created_at: "2023-11-15T10:20:00",
  },
  {
    id: 2,
    name: "react-chat-app",
    description:
      "A real-time chat application using React, Socket.io, and Firebase.",
    stars: 180,
    updated: "2024-01-25T18:45:00",
    created_at: "2023-09-01T08:00:00",
  },
  {
    id: 3,
    name: "AI-code-helper",
    description:
      "An AI-powered tool that assists with writing code efficiently.",
    stars: 315,
    updated: "2024-02-05T09:15:00",
    created_at: "2022-12-20T16:30:00",
  },
  {
    id: 4,
    name: "open-source-dashboard",
    description:
      "An open-source dashboard for monitoring analytics and performance.",
    stars: 90,
    updated: "2024-02-08T12:00:00",
    created_at: "2023-07-10T14:45:00",
  },
  {
    id: 5,
    name: "machine-learning-experiments",
    description: "A collection of machine learning models and experiments.",
    stars: 270,
    updated: "2024-02-12T20:10:00",
    created_at: "2023-03-05T09:30:00",
  },
];

function getFormattedDateTime(timestamp) {
  const date = new Date(timestamp + "Z");
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

const Starred = () => {
  const [starredRepos, setStarredRepos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    setLoading(true);
    const user = getCurrentUser();
    if (user) {
      const fetchStarredRepos = async () => {
        try {
          const response = await axiosInstance.get(
            `/getStarredRepositories?username=${user.username}`
          );
          setStarredRepos(response.data.repositories);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching starred repos:", error);
          setLoading(false);
        }
      };
      fetchStarredRepos();
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

  const handleUnstar = (repoId) => {
    setStarredRepos((prevRepos) =>
      prevRepos.filter((repo) => repo.id !== repoId)
    );
  };

  const filteredRepos = dummyStarredRepos
    .filter((repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "stars"
        ? b.stars - a.stars
        : sortBy === "name"
        ? a.name.localeCompare(b.name)
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
            Starred Repositories
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Search Starred Repos"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FormControl size="small" sx={{ minWidth: "100px" }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
                sx={{ minWidth: "200px" }}
              >
                <MenuItem value="updated">Last Updated</MenuItem>
                <MenuItem value="stars">Stars</MenuItem>
                <MenuItem value="name">Name</MenuItem>
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
                    <Typography variant="h6" fontWeight="bold">
                      {repo.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {repo.description || "No description available."}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
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
                    <Tooltip title="Unstar Repository">
                      <IconButton onClick={() => handleUnstar(repo.id)}>
                        <RemoveCircleOutlineIcon sx={{ color: "red" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Star Count">
                      <IconButton>
                        <StarIcon sx={{ color: "gold" }} />
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
              You haven't starred any repositories yet.
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Starred;
