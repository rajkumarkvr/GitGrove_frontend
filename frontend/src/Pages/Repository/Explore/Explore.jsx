import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Container,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
  Grid,
  useTheme,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { motion } from "framer-motion";
import axiosInstance from "../../../axiosInstance";
import { useNavigate } from "react-router-dom";
import getCurrentUser from "../../../Contexts/getCurrentUser";

const Explore = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // States
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState("most_stars");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [starredRepos, setStarredRepos] = useState(new Set());
  const [topRepositories, setTopRepositories] = useState([]);
  // Fetch repositories from API
  const fetchRepositories = async (searchTerm = "", page = 1) => {
    if (isFetching) return;
    if (searchTerm !== "") setRepositories([]);
    setIsFetching(true);
    setLoading(true);
    // setRepositories(mockRepositories);
    try {
      console.log("Fetching repositories");
      const response = await axiosInstance.get(
        "/service/explore/repositories",
        {
          params: {
            page,
            per_page: 10,
            search: searchTerm,
            username: getCurrentUser()?.username,
          },
        }
      );

      console.log(response.data.repositories);
      const newRepositories = response.data?.repositories;
      if (newRepositories == undefined || newRepositories == null) {
        return;
      }
      // setRepositories(newRepositories);
      if (newRepositories && newRepositories.length === 0) {
        setHasMore(false);
        return;
      }

      // setRepositories(newRepositories);
      setRepositories((prevRepos) => {
        const existingRepoIds = new Set(prevRepos.map((repo) => repo.id));
        const filteredNewRepos = newRepositories.filter(
          (repo) => !existingRepoIds.has(repo.id)
        );

        return [...prevRepos, ...filteredNewRepos];
      });
    } catch (error) {
      console.error("Error fetching repositories:", error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const fetchTopRepositories = async () => {
      try {
        const response = await axiosInstance.get(
          "/service/explore/top_repositories",
          {
            params: {
              limit: 3,
              username: getCurrentUser()?.username,
            },
          }
        );
        console.log(response.data.repositories);
        setTopRepositories(response.data.repositories);
      } catch (error) {
        console.error("Error fetching top repositories:", error);
      }
    };
    fetchTopRepositories();
  }, []);

  // Handle sorting
  const sortedRepositories = useMemo(() => {
    let sortedRepos = [...repositories];

    switch (sorting) {
      case "most_stars":
        sortedRepos.sort((a, b) => b.stars - a.stars);
        break;
      case "least_stars":
        sortedRepos.sort((a, b) => a.stars - b.stars);
        break;
      case "recently_updated":
        sortedRepos.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        break;
      default:
        break;
    }

    return sortedRepos;
  }, [repositories, sorting]);

  // Handle search input
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setPage(1);
    fetchRepositories(term, 1);
  };

  // Handle star click
  const handleStarClick = async (e, repoId) => {
    e.stopPropagation();
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
  // Handle repository click
  const handleRepoClick = (username, repoName) => {
    navigate(`/repo/${username}/${repoName}`);
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 50 >=
      document.documentElement.offsetHeight
    ) {
      if (hasMore && !isFetching) setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetching]);

  useEffect(() => {
    console.log("Scrolling");
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchRepositories(searchTerm, page);
  }, [searchTerm, page]);

  return (
    <Container maxWidth="lg" sx={{ pt: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2, p: 2 }}
      >
        <TextField
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search Repositories"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ ml: 2 }}>
          <Select
            value={sorting}
            onChange={(e) => setSorting(e.target.value)}
            startAdornment={<ArrowDropDownIcon />}
          >
            <MenuItem value="most_stars">Most Stars</MenuItem>
            <MenuItem value="least_stars">Least Stars</MenuItem>
            <MenuItem value="recently_updated">Recently Updated</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {/* Repository List */}
        <Grid item xs={8}>
          <List>
            {sortedRepositories.map((repo) => (
              <motion.div
                key={repo.id}
                whileHover={{ scale: 1.02, cursor: "pointer" }}
              >
                <Paper
                  sx={{ p: 2, mb: 1, display: "flex" }}
                  onClick={() =>
                    handleRepoClick(repo.owner.username, repo.name)
                  }
                >
                  <Avatar src={repo.owner.avatar} sx={{ mr: 2 }} />
                  <ListItemText
                    primary={repo.name}
                    secondary={`${repo.owner.username} • ${repo.stars} ⭐`}
                  />

                  {/* Star Button */}
                  <Tooltip title="Star Repository">
                    <IconButton onClick={(e) => handleStarClick(e, repo.id)}>
                      {starredRepos.has(repo.id) || repo.isStarred ? (
                        <StarIcon color="warning" />
                      ) : (
                        <StarBorderIcon />
                      )}
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {repo.stars}
                      </Typography>
                    </IconButton>
                  </Tooltip>
                </Paper>
              </motion.div>
            ))}
          </List>
        </Grid>
        {isFetching && <CircularProgress />}
        <Paper sx={{ p: 2, mt: 2, ml: 10, position: "absolute", right: 100 }}>
          <Typography variant="h6" gutterBottom>
            🔥 Top Starred Repositories
          </Typography>
          <List>
            {topRepositories &&
              topRepositories.length > 0 &&
              topRepositories.map((repo) => (
                <ListItem
                  key={repo.id}
                  button
                  onClick={() =>
                    navigate(`/repo/${repo.owner.username}/${repo.name}`)
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={repo.owner.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={repo.name}
                    secondary={`${repo.owner.username} • ${repo.stars} ⭐`}
                  />
                  <Tooltip title="Star Repository">
                    <IconButton
                      onClick={(event) => handleStarClick(event, repo.id)}
                    >
                      {starredRepos.has(repo.id) ? (
                        <StarIcon color="warning" />
                      ) : (
                        <StarBorderIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
          </List>
        </Paper>
      </Grid>
    </Container>
  );
};

export default Explore;
