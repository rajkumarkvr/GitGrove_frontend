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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Link } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const sampleRepositories = [
  {
    id: 1,
    name: "gitgrove-core",
    description: "Core backend for GitGrove platform",
    updated: "2025-02-10T12:30:00Z",
    stars: 45,
    url: "https://github.com/user/gitgrove-core",
  },
  {
    id: 2,
    name: "gitgrove-ui",
    description: "Frontend for GitGrove with Material UI",
    updated: "2025-02-08T09:15:00Z",
    stars: 32,
    url: "https://github.com/user/gitgrove-ui",
  },
  {
    id: 3,
    name: "api-gateway",
    description: "API Gateway for microservices",
    updated: "2025-01-25T18:45:00Z",
    stars: 50,
    url: "https://github.com/user/api-gateway",
  },
  {
    id: 4,
    name: "notification-service",
    description: "Manages real-time notifications",
    updated: "2025-02-05T10:20:00Z",
    stars: 22,
    url: "https://github.com/user/notification-service",
  },
  {
    id: 5,
    name: "auth-service",
    description: "JWT-based authentication",
    updated: "2025-01-29T14:10:00Z",
    stars: 40,
    url: "https://github.com/user/auth-service",
  },
  {
    id: 6,
    name: "database-manager",
    description: "Handles database migrations and schemas",
    updated: "2025-01-30T11:30:00Z",
    stars: 28,
    url: "https://github.com/user/database-manager",
  },
  {
    id: 7,
    name: "image-processor",
    description: "Optimizes and resizes images",
    updated: "2025-02-07T16:00:00Z",
    stars: 36,
    url: "https://github.com/user/image-processor",
  },
  {
    id: 8,
    name: "log-aggregator",
    description: "Centralized logging system",
    updated: "2025-02-01T08:50:00Z",
    stars: 21,
    url: "https://github.com/user/log-aggregator",
  },
];

const MyRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated");

  useEffect(() => {
    const fetchRepos = async () => {
      const repos = await axiosInstance.post();
      setRepositories(repos);
    };
    fetchRepos();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const filteredRepos = sampleRepositories
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
      {/* Fixed Header */}
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

      {/* Repository Grid */}
      <Box
        sx={{
          mt: 12,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 5,
        }}
      >
        {filteredRepos.length > 0 ? (
          filteredRepos.map((repo) => (
            <Card
              key={repo.id}
              sx={{
                p: 2,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
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
                <Typography variant="caption" color="text.secondary">
                  Last updated: {new Date(repo.updated).toLocaleDateString()}
                </Typography>
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
                  <IconButton component={Link} to={`/repo/${repo.id}`}>
                    <VisibilityIcon color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Star Count">
                  <IconButton>
                    <StarBorderIcon />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {repo.stars}
                    </Typography>
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          ))
        ) : (
          <Typography variant="h6" textAlign="center" color="text.secondary">
            No repositories found.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default MyRepositories;
