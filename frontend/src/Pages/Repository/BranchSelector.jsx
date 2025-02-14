import React, { useState } from "react";
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
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion"; // For smooth animations

const BranchSelector = ({ branches, selectedBranch, onBranchChange }) => {
  console.log(branches);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentBranch, setCurrentBranch] = useState(selectedBranch);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleBranchSelect = (branch) => {
    setCurrentBranch(branch);
    onBranchChange({ target: { value: branch } });
    handleClose();
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
      }}
    >
      {/* New Creative Selector Design */}
      <motion.div whileHover={{ scale: 1.05 }}>
        <IconButton
          onClick={handleOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: "1px solid #ddd",
            px: 2,
            py: 1,
            borderRadius: "8px",
            backgroundColor: "white",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <AccountTreeIcon sx={{ color: "primary.main" }} />
          <Typography variant="body1" fontWeight="bold">
            {currentBranch}
          </Typography>
          <ArrowDropDownIcon />
        </IconButton>
      </motion.div>

      {/* Popover Menu */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          {/* Search Field */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search branch..."
            variant="outlined"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />

          {/* Branch List with Scroll Fix */}
          <List
            sx={{
              maxHeight: 200,
              overflowY: filteredBranches.length > 5 ? "auto" : "hidden",
              mt: 1,
              borderTop: "1px solid #eee",
            }}
          >
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <motion.div
                  key={branch}
                  whileHover={{ scale: 1.02, backgroundColor: "#f1f1f1" }}
                  transition={{ duration: 0.2 }}
                >
                  <ListItem
                    sx={{ cursor: "pointer" }}
                    button
                    onClick={() => handleBranchSelect(branch)}
                    selected={branch === currentBranch}
                  >
                    <ListItemText primary={branch} />
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
                  color: "gray",
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
