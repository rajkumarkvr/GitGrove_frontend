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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import getCurrentUser from "../../Contexts/getCurrentUser";

const MyRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
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

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      {/* App Bar */}
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
          // **Skeleton Loading Effect**
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="circular" width={24} height={24} />
                </Box>

                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="70%" />

                <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" width="50%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="50%" sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="80%" />
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
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </Box>
            </Card>
          ))
        ) : repositories.length > 0 ? (
          repositories.map((repo) => (
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
                    <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {repo.description || "No description available."}
                  </Typography>

                  <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight="bold">
                      Last Updated:
                    </Typography>
                    <Typography variant="body2">{repo.updated}</Typography>
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      sx={{ mt: 1 }}
                    >
                      Created At:
                    </Typography>
                    <Typography variant="body2">{repo.created_at}</Typography>
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
                      <StarBorderIcon />
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

      {/* Menu for repository actions */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MuiMenuItem onClick={() => console.log("Deleting repository")}>
          <DeleteIcon sx={{ mr: 1, color: "red" }} />
          Delete
        </MuiMenuItem>
      </Menu>
    </Container>
  );
};

export default MyRepositories;
