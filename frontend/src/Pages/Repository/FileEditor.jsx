import React, { useState } from "react";
import {
  Box,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
  Alert,
  Divider,
  useTheme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import { motion } from "framer-motion";
import CodeMirror from "@uiw/react-codemirror";
import { dracula, githubLight } from "@uiw/codemirror-themes-all";
import { javascript } from "@codemirror/lang-javascript";
import handleCopy from "../../CustomHooks/handleCopy";

const FileEditor = ({ file }) => {
  console.log(file);
  if (!file) return <Typography>Select a file to view its content</Typography>;

  const theme = useTheme(); // Get MUI theme
  const isDarkMode = theme.palette.mode === "dark";

  const [copied, setCopied] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleDownload = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([file.content.content], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSnackbarMessage("File downloaded successfully!");
    setCopied(true);
  };
  const isImage = ["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp"];
  const isVideo = ["mp4", "webm", "ogg", "mov", "avi", "flv", "mkv"];
  const isAudio = ["mp3", "wav", "ogg", "flac", "aac", "m4a"];
  const fileExt = file.name.split(".").pop().toLowerCase();
  const mimeTypes = {
    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",
    mov: "video/quicktime",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aac: "audio/aac",
    flac: "audio/flac",
  };
  const getMimeType = (fileExt) => {
    console.log(fileExt);
    mimeTypes[fileExt?.toLowerCase()] || "application/octet-stream";
  };
  // console.log(getMimeType("mp4"));
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
          bgcolor: theme.palette.background.paper, // Dynamic background
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          minWidth: "1000px",
          maxWidth: "1200px",
          margin: "auto",
          minHeight: "800px",
          color: theme.palette.text.primary, // Dynamic text color
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
            <Typography variant="h6">{file.name}</Typography>

            {/* Toolbar */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {/* Copy Content */}
              <Tooltip title="Copy Content">
                <IconButton
                  onClick={() => {
                    handleCopy(file.content.content, setCopied);
                    setSnackbarMessage("File content copied!");
                  }}
                  color="inherit"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>

              {/* Download File */}
              <Tooltip title="Download File">
                <IconButton onClick={handleDownload} color="inherit">
                  <CloudDownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>

        <Divider sx={{ mb: 2 }} />

        {/* Code Editor */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: "400px",
              maxHeight: "50vh",
              minHeight: "800px",
              display: "flex",
              flexDirection: "column",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {isImage.includes(fileExt) ? (
              // <img
              //   width={file.content.width + "px"}
              //   height={file.content.height + "px"}
              <img
                src={`data:image/${fileExt};base64,${file.content.content}`}
                alt={file.name}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ) : isVideo.includes(fileExt) ? (
              <video controls style={{ maxWidth: "100%", height: "auto" }}>
                <source
                  src={`data:${getMimeType(fileExt)};base64,${
                    file.content.content
                  }`}
                  type={getMimeType(fileExt)}
                />
                Your browser does not support the video tag.
              </video>
            ) : isAudio.includes(fileExt) ? (
              <audio controls>
                <source
                  src={`data:${getMimeType(fileExt)};base64,${
                    file.content.content
                  }`}
                  type={getMimeType(fileExt)}
                />
                Your browser does not support the audio tag.
              </audio>
            ) : (
              <CodeMirror
                value={file.content.content}
                extensions={[javascript()]}
                theme={isDarkMode ? dracula : githubLight}
                options={{
                  readOnly: true,
                  lineNumbers: true,
                }}
                style={{
                  flexGrow: 1,
                  overflowY: "auto",
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                }}
              />
            )}
          </Box>
        </motion.div>

        {/* Word Count */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "right",
            mt: 1,
            color: theme.palette.text.secondary,
          }}
        >
          Word Count: {file?.content?.content?.split(/\s+/)?.length}
        </Typography>

        <Snackbar
          open={copied}
          autoHideDuration={2000}
          onClose={() => setCopied(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success">{snackbarMessage}</Alert>
        </Snackbar>
      </Box>
    </motion.div>
  );
};

export default FileEditor;
