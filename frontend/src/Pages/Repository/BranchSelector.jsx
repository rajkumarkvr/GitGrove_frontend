import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Popover,
  Box,
  Typography,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import axiosInstance from "../../axiosInstance";

const BranchSelector = ({
  branches,
  selectedBranch,
  username,
  setRepos,
  reponame,
}) => {
  const theme = useTheme(); // Get current theme mode
  const isDarkMode = theme.palette.mode === "dark"; // Check if dark mode is active

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentBranch, setCurrentBranch] = useState(selectedBranch);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    sessionStorage.setItem("branch", currentBranch);
  }, [currentBranch]);
  const handleBranchSelect = (branch) => {
    setCurrentBranch(branch);

    const fetchBranchOrientedData = async () => {
      try {
        const response = await axiosInstance.get(
          `service/repo-info?username=${username}&reponame=${reponame}&branchname=${branch}`
        );
        setRepos(response.data);
        handleClose();
      } catch (error) {
        console.error(error);
        handleClose();
      }
    };
    fetchBranchOrientedData();
  };

  const filteredBranches =
    branches == null
      ? []
      : branches.filter((branch) =>
          branch.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        my: 2,
        flexWrap: "wrap",
        mt: 3,
      }}
    >
      <motion.div whileHover={{ scale: 1.05 }}>
        <IconButton
          onClick={handleOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: `1px solid ${theme.palette.divider}`,
            px: 2,
            py: 1,
            borderRadius: "8px",
            backgroundColor: isDarkMode
              ? theme.palette.background.paper
              : "white",
            "&:hover": { backgroundColor: isDarkMode ? "#333" : "#f5f5f5" },
          }}
        >
          <AccountTreeIcon sx={{ color: theme.palette.primary.main }} />
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{ color: theme.palette.text.primary }}
          >
            {currentBranch}
          </Typography>
          <ArrowDropDownIcon sx={{ color: theme.palette.text.primary }} />
        </IconButton>
      </motion.div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box
          sx={{
            p: 2,
            width: 250,
            backgroundColor: theme.palette.background.default,
          }}
        >
          {/* Search Field */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search branch..."
            variant="outlined"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            sx={{
              input: { color: theme.palette.text.primary },
              fieldset: { borderColor: theme.palette.divider },
            }}
          />

          {/* Branch List */}
          <List
            sx={{
              maxHeight: 200,
              overflowY: filteredBranches.length > 5 ? "auto" : "hidden",
              mt: 1,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <motion.div
                  key={branch}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: isDarkMode ? "#444" : "#f1f1f1",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ListItem
                    sx={{
                      cursor: "pointer",
                      color: theme.palette.text.primary,
                      "&:hover": {
                        backgroundColor: isDarkMode ? "#555" : "#eee",
                      },
                    }}
                    button
                    onClick={() => handleBranchSelect(branch)}
                    selected={branch === currentBranch}
                  >
                    <ListItemText
                      primary={branch}
                      sx={{ color: theme.palette.text.primary }}
                    />
                    {branch === currentBranch && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircleIcon color="success" />
                      </motion.div>
                    )}
                  </ListItem>
                </motion.div>
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: theme.palette.text.secondary,
                  py: 2,
                }}
              >
                No branches found.
              </Typography>
            )}
          </List>
        </Box>
      </Popover>
    </Box>
  );
};

export default BranchSelector;
