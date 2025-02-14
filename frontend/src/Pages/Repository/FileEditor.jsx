import React, { useState } from "react";
import {
  Box,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
  Alert,
  Switch,
  Divider,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { motion } from "framer-motion";
import CodeMirror from "@uiw/react-codemirror";
import { dracula, githubLight } from "@uiw/codemirror-themes-all";
import { javascript } from "@codemirror/lang-javascript";

const FileEditor = ({ file }) => {
  if (!file) return <Typography>Select a file to view its content</Typography>;

  const [copied, setCopied] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [theme, setTheme] = useState("light");

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setSnackbarMessage("File content copied!");
    setCopied(true);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([file.content], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSnackbarMessage("File downloaded successfully!");
    setCopied(true);
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          bgcolor: theme === "dark" ? "#282c34" : "#fff",
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          minWidth: "1000px",
          maxWidth: "1200px", // Set a max width for better responsiveness
          margin: "auto",
          minHeight: "800px",
        }}
      >
        {/* Header with animations */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: theme === "dark" ? "#fff" : "#000" }}
            >
              {file.name}
            </Typography>

            {/* Toolbar */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {/* Theme Toggle */}
              <Tooltip title="Toggle Theme">
                <IconButton onClick={toggleTheme}>
                  {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>

              {/* Copy Content */}
              <Tooltip title="Copy Content">
                <IconButton onClick={handleCopy}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>

              {/* Download File */}
              <Tooltip title="Download File">
                <IconButton onClick={handleDownload}>
                  <CloudDownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>

        <Divider sx={{ mb: 2 }} />

        {/* Fixed Height Scrollable Code Editor */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: "400px", // Fixed height for consistency
              maxHeight: "50vh", // Ensures responsiveness on smaller screens
              minHeight: "800px", // Prevents collapsing
              display: "flex",
              flexDirection: "column",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <CodeMirror
              value={file.content}
              extensions={[javascript()]}
              theme={theme === "dark" ? dracula : githubLight}
              options={{
                readOnly: true,
                lineNumbers: true,
              }}
              style={{
                flexGrow: 1, // Ensures editor stays within fixed height
                overflowY: "auto", // Enables scrolling for long content
              }}
            />
          </Box>
        </motion.div>

        {/* Word Count */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "right",
            mt: 1,
            color: theme === "dark" ? "#aaa" : "#666",
          }}
        >
          Word Count: {file.content.split(/\s+/).length}
        </Typography>

        {/* Snackbar Notification */}
        <Snackbar
          open={copied}
          autoHideDuration={2000}
          onClose={() => setCopied(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ bgcolor: "#4caf50", color: "white" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
};

export default FileEditor;
