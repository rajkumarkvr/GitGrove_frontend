import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CommitIcon from "@mui/icons-material/Commit";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link for navigation
import BackLink from "../../Components/BackLink";

const CommitList = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState("");
  const [commits, setCommits] = useState([]);
  const [reponame, setReponame] = useState("");
  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const c = sessionStorage.getItem("commits");
    if (c != null && c.length !== 0) {
      const commitDetails = JSON.parse(c);
      // console.log("Mail" + ;
      setCommits(JSON.parse(commitDetails.commits));
      setReponame(commitDetails.reponame);
    }
    // return () => {

    //   sessionStorage.removeItem("commits");
    // };
  }, []);
  return (
    <>
      <BackLink to={`/repo/${reponame}`} label="Back to repo" />
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: "#f9f9f9" }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            <CommitIcon sx={{ mr: 1, color: "primary.main" }} /> Recent Commits
          </Typography>
        </motion.div>

        <List>
          {commits &&
            commits.map((commit, index) => (
              <motion.div
                key={commit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ListItem sx={{ display: "flex", alignItems: "center", p: 1 }}>
                  {/* Avatar with Hover Effect */}
                  <ListItemAvatar>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Avatar src={commit.authorAvatar || ""}>
                        {!commit.authorAvatar && <AccountCircleIcon />}
                      </Avatar>
                    </motion.div>
                  </ListItemAvatar>

                  {/* Commit Message & Author Details */}
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ color: "text.primary" }}
                      >
                        {commit.message}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        {commit.authorName} •{" "}
                        {new Date(commit.date).toLocaleString()}
                      </Typography>
                    }
                  />

                  {/* Commit Hash Link */}
                  <Tooltip title="View Commit Details">
                    <Link
                      to={`/commit/${commit.hash || "2dt3gsf5"}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "blue",
                          fontWeight: "bold",
                          cursor: "pointer",
                          mx: 1,
                        }}
                      >
                        {"2dt3gsf5"}
                        {/* {commit.hash.slice(0, 7)} */}
                      </Typography>
                    </Link>
                  </Tooltip>

                  {/* Copy Hash Button with Animation */}
                  <Tooltip title="Copy Commit Hash">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleCopyHash(commit.hash)}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </motion.div>
                  </Tooltip>
                </ListItem>
                {index !== commits.length - 1 && <Divider />}
              </motion.div>
            ))}
        </List>

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="info">Commit Hash Copied: {copiedHash}</Alert>
        </Snackbar>
      </Paper>
    </>
  );
};

export default CommitList;
