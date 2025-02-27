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
  Skeleton,
  useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import getCurrentUser from "../../Contexts/getCurrentUser";
import getFormattedDateTime from "../../CustomHooks/getFormattedDateTime";

const Starred = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [loading, setLoading] = useState(true);
  const [starredRepos, setStarredRepos] = useState(new Set());

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const fetchRepos = async () => {
        try {
          const response = await axiosInstance.get(
            `service/getstarredrepositories?username=${user.username}`
          );
          console.log(response?.data?.repositories);
          setRepositories(response?.data?.repositories || []);

          const starredRepoIds = new Set(
            response?.data?.repositories?.map((repo) => repo.id)
          );
          setStarredRepos(starredRepoIds);
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

  if (repositories == null || repositories.length == 0) {
    return (
      <Typography variant="h6" textAlign="center" color="text.secondary">
        You have not starred any repositories yet!
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

  // Handle starring/unstarring a repository
  const handleStarClick = async (repoId) => {
    const user = getCurrentUser();
    if (!user) return navigate("/login");

    try {
      const isStarred = starredRepos.has(repoId);
      const apiUrl = `service/AddStarToRepository?username=${user.username}&repoid=${repoId}`;

      if (isStarred) {
        console.log("is starred passed");
        await axiosInstance.post(apiUrl);
        setStarredRepos((prev) => {
          const newSet = new Set(prev);
          newSet.delete(repoId);
          return newSet;
        });
        setRepositories((prevRepos) =>
          prevRepos.filter((repo) => repo.id !== repoId)
        );
      } else {
        console.log("is starred fails");
        await axiosInstance.post(apiUrl);
        setStarredRepos((prev) => new Set(prev).add(repoId));

        setRepositories((prevRepos) =>
          prevRepos.map((repo) =>
            repo.id === repoId ? { ...repo, stars: repo.stars + 1 } : repo
          )
        );
      }
    } catch (error) {
      console.log("Error starring repository:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        color="default"
        sx={{ top: 0, left: 0, right: 0, zIndex: 110, boxShadow: 2 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
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
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Repositories List */}
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
            <Card
              key={index}
              sx={{
                p: 2,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
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
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="70%" />
              </CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", p: 1 }}
              >
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </Box>
            </Card>
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
                    {repo.description || "No description available"}
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

                {/* Buttons Section */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                  }}
                >
                  <Tooltip title="View Repository">
                    <IconButton component={Link} to={`/repo/${repo.name}`}>
                      <VisibilityIcon color="primary" />
                    </IconButton>
                  </Tooltip>

                  {/* Star/Unstar Button */}
                  <Tooltip
                    title={
                      starredRepos.has(repo.id)
                        ? "Unstar Repository"
                        : "Star Repository"
                    }
                  >
                    <IconButton onClick={() => handleStarClick(repo.id)}>
                      {starredRepos.has(repo.id) || repo.isStarred ? (
                        <StarIcon sx={{ color: "gold" }} />
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
            You have not starred any repositories yet!
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Starred;
