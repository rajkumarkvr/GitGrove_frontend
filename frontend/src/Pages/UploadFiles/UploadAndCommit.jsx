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
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BranchSelectorUpload from "./BranchSelectorUpload";
import BackLink from "../../Components/BackLink";

const UploadAndCommit = ({
  onCommit,
  onCancel,
  branches,
  username,
  reponame,
  created,
  setCreated,
  loading,
  uploadFail,
  setUploadFail,
}) => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "*",
    multiple: true,
    directory: true,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDrop: (acceptedFiles) => {
      setIsDragActive(false);
      const updatedFiles = acceptedFiles.map((file) => {
        return file;
      });
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles, ...updatedFiles];
        console.log("Updated files state:", newFiles);
        return newFiles;
      });
    },
  });

  const removeFile = (fileName) => {
    setFiles(files.filter((file) => file.relativePath !== fileName));
  };

  const handleCommit = () => {
    if (!selectedBranch) {
      setSnackbarOpen(true);
      return;
    }
    const finalCommitMessage = commitMessage.trim()
      ? commitMessage
      : "Committed changes";
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
      rajkumar
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom mb={3}>
        <BackLink to={`/repo/${username}/${reponame}`} />
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${theme.palette.primary.main}`,
          padding: theme.spacing(4),
          textAlign: "center",
          cursor: "pointer",
          borderRadius: 2,
          backgroundColor: isDragActive
            ? theme.palette.primary.light
            : theme.palette.action.hover, // Highlight effect
          transition: "background-color 0.3s ease",
        }}
        component={motion.div}
        whileHover={{ scale: 1.02 }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon
          sx={{
            fontSize: 50,
            color: isDragActive
              ? theme.palette.primary.dark
              : theme.palette.primary.main,
            transition: "color 0.3s ease",
          }}
        />
        <Typography variant="body1" mt={2} color="textSecondary">
          {isDragActive
            ? "Drop the files here..."
            : "Drag & Drop files or click to select"}
        </Typography>
      </Box>
      {files.length > 0 && (
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            rajkumar Selected Files:
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
                <Typography variant="body2">{file.relativePath}</Typography>
                <IconButton
                  size="small"
                  onClick={() => removeFile(file.relativePath)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            ))}
          </Paper>
        </Box>
      )}
      {/* Commit Section */}
      <Box mt={4}>
        <BranchSelectorUpload
          selectedBranch={"master"}
          onChange={setSelectedBranch}
          branches={branches}
        />
        <TextField
          label="Commit Message"
          fullWidth
          margin="normal"
          variant="outlined"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          helperText="Provide a brief message for this commit."
        />

        {loading && (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        )}
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

      {/* Success Snackbar */}
      <Snackbar
        open={created}
        autoHideDuration={3000}
        onClose={() => setCreated(false)}
        message="File(s) were uploaded successfully!"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
            fontWeight: "bold",
            borderRadius: "8px",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 12px rgba(255, 255, 255, 0.1)"
                : "0 4px 12px rgba(0, 0, 0, 0.2)",
            padding: "12px 24px",
            border:
              theme.palette.mode === "dark"
                ? `1px solid ${theme.palette.success.dark}`
                : "none",
          },
        }}
      />

      {/* Failure Snackbar */}
      <Snackbar
        open={uploadFail}
        autoHideDuration={3000}
        onClose={() => setUploadFail(false)}
        message="Failed to upload file(s). Please try again."
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            fontWeight: "bold",
            borderRadius: "8px",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 12px rgba(255, 255, 255, 0.1)"
                : "0 4px 12px rgba(0, 0, 0, 0.2)",
            padding: "12px 24px",
            border:
              theme.palette.mode === "dark"
                ? `1px solid ${theme.palette.error.dark}`
                : "none",
          },
        }}
      />
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
