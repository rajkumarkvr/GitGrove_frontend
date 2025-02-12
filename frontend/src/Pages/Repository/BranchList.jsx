import React from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

const BranchList = ({ branches, selectedBranch, onBranchChange }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
      <AccountTreeIcon />
      <Typography variant="body1">Branches ({branches.length})</Typography>
      <FormControl size="small">
        <InputLabel>Select Branch</InputLabel>
        <Select value={selectedBranch} onChange={onBranchChange}>
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
