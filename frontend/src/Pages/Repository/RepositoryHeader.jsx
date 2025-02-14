import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Snackbar,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const RepositoryHeader = ({ repoName, sshUrl, username }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sshUrl);
    setCopied(true);
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        sx={{ boxShadow: 2, padding: 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {username} / {repoName}
            </Typography>
          </Toolbar>
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

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="SSH URL copied!"
      />
    </>
  );
};

export default RepositoryHeader;
