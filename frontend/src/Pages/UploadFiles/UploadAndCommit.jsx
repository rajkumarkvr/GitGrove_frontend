import React, { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
  Snackbar,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BranchSelector from "../Repository/BranchSelector";

const UploadAndCommit = ({ onCommit, onCancel }) => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Handle file drop
  const { getRootProps, getInputProps } = useDropzone({
    accept: "*",
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
  });

  // Remove a file
  const removeFile = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  // Handle Commit Action
  const handleCommit = () => {
    if (!selectedBranch) {
      setSnackbarOpen(true);
      return;
    }
    const finalCommitMessage = commitMessage.trim()
      ? commitMessage
      : "Committed changes"; // Default commit message
    onCommit({
      branch: selectedBranch,
      files,
      commitMessage: finalCommitMessage,
    });
    setFiles([]);
    setCommitMessage("");
    setSelectedBranch(null);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        padding: theme.spacing(4),
        maxWidth: 700,
        margin: "auto",
        backgroundColor: theme.palette.background.paper,
      }}
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Drag & Drop Upload Section */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Upload Files & Commit Changes
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${theme.palette.primary.main}`,
          padding: theme.spacing(4),
          textAlign: "center",
          cursor: "pointer",
          borderRadius: 2,
          backgroundColor: theme.palette.action.hover,
        }}
        component={motion.div}
        whileHover={{ scale: 1.02 }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon
          sx={{ fontSize: 50, color: theme.palette.primary.main }}
        />
        <Typography variant="body1" mt={2} color="textSecondary">
          Drag & Drop files or click to select
        </Typography>
      </Box>

      {/* File List Section */}
      {files.length > 0 && (
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Selected Files:
          </Typography>
          <Paper
            elevation={1}
            sx={{
              maxHeight: 200,
              overflowY: "auto",
              padding: theme.spacing(2),
              backgroundColor: theme.palette.background.default,
              borderRadius: 2,
            }}
          >
            {files.map((file, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: theme.spacing(1),
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="body2">{file.name}</Typography>
                <IconButton size="small" onClick={() => removeFile(file.name)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            ))}
          </Paper>
        </Box>
      )}

      {/* Commit Section */}
      <Box mt={4}>
        <BranchSelector value={selectedBranch} onChange={setSelectedBranch} />
        <TextField
          label="Commit Message"
          fullWidth
          margin="normal"
          variant="outlined"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          helperText="Provide a brief message for this commit."
        />

        {/* Action Buttons */}
        <Box mt={3} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCommit}
            disabled={files.length === 0 || !selectedBranch}
            startIcon={<UploadFileIcon />}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
          >
            Commit Changes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Please select a branch before committing!"
      />
    </Paper>
  );
};

export default UploadAndCommit;
