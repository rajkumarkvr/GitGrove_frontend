import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CodeMirror from "@uiw/react-codemirror"; // For syntax highlighting

const FileEditor = ({ file }) => {
  if (!file) return <Typography>Select a file to view its content</Typography>;

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6">{file.name}</Typography>
        <div>
          <Tooltip title="Copy Content">
            <IconButton onClick={handleCopy}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download File">
            <IconButton
              component="a"
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                file.content
              )}`}
              download={file.name}
            >
              <CloudDownloadIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Box>
      <CodeMirror value={file.content} options={{ readOnly: true }} />
    </Box>
  );
};

export default FileEditor;
