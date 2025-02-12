import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const RepositoryHeader = ({ repoName, sshUrl }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(sshUrl);
  };

  return (
    <AppBar position="static" color="default">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          {repoName}
        </Typography>
        <div>
          <Tooltip title="Copy SSH URL">
            <IconButton onClick={handleCopy}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<CloudDownloadIcon />}
            sx={{ ml: 2 }}
          >
            Download ZIP
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default RepositoryHeader;
