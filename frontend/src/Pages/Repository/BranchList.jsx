import React from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

const BranchList = ({ branches, selectedBranch, onBranchChange }) => {
  const theme = useTheme(); // Get current theme
  const isDarkMode = theme.palette.mode === "dark"; // Check if dark mode is active

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        my: 2,
        backgroundColor: isDarkMode ? "#333" : "#f5f5f5", // Dynamic background
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <AccountTreeIcon sx={{ color: theme.palette.text.primary }} />

      <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
        Branches ({branches.length})
      </Typography>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel sx={{ color: theme.palette.text.secondary }}>
          Select Branch
        </InputLabel>
        <Select
          value={selectedBranch}
          onChange={onBranchChange}
          sx={{
            backgroundColor: theme.palette.background.paper, // Adaptive background
            color: theme.palette.text.primary, // Adaptive text
            "& .MuiSvgIcon-root": { color: theme.palette.text.primary }, // Dropdown icon color
          }}
        >
          {branches.map((branch) => (
            <MenuItem key={branch} value={branch}>
              {branch}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default BranchList;
