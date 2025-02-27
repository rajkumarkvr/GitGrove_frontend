import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  IconButton,
  Chip,
  Paper,
  Skeleton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const ViewPullRequestsDialog = ({ open, handleClose, repoName, username }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pullRequests, setPullRequests] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchPullRequests = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(
            `/service/getpullrequests?reponame=${encodeURIComponent(
              repoName
            )}&ownername=${username}`
          );
          console.log(response.data.pullRequests);
          setPullRequests(response.data.pullRequests);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching pull requests:", err);
          setLoading(false);
        }
      };
      fetchPullRequests();
    }
  }, [open, repoName]);

  const openPRs = pullRequests.filter((pr) => pr.status === "OPEN");
  const closedPRs = pullRequests.filter(
    (pr) => pr.status === "MERGED" || pr.status === "CLOSED"
  );
  const handleOpenPRClick = (id, details) => {
    navigate(
      `/pull-requests/${username}/${repoName}/${id}/${encodeURIComponent(
        encodeURIComponent(details.title)
      )}/${details.createrName}/${encodeURIComponent(
        details.sourceBranch
      )}/${encodeURIComponent(details.targetBranch)}`
    );
  };

  // Skeleton Loaders for List
  const renderSkeletonList = (numItems = 4) => (
    <List>
      {Array.from({ length: numItems }).map((_, index) => (
        <ListItem
          key={index}
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton width="50%" />}
            secondary={<Skeleton width="70%" />}
          />
          <Skeleton variant="rectangular" width={80} height={24} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Dialog Header */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          View Pull Requests - {repoName}
          <IconButton
            onClick={handleClose}
            sx={{ color: theme.palette.text.primary }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Tab Navigation */}
        <Paper
          sx={{
            borderBottom: 1,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": {
                fontWeight: "bold",
                color: theme.palette.text.primary,
              },
              "& .Mui-selected": { color: theme.palette.primary.main },
            }}
          >
            <Tab label="Open" />
            <Tab label="Closed" />
          </Tabs>
        </Paper>

        <DialogContent
          sx={{
            minHeight: "40vh",
            maxHeight: "40vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <AnimatePresence mode="wait">
            {tabIndex === 0 ? (
              <motion.div
                key="open-prs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? (
                  renderSkeletonList()
                ) : openPRs.length > 0 ? (
                  <List>
                    {openPRs.map((pr) => (
                      <ListItem
                        key={pr.id}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                        onClick={() =>
                          handleOpenPRClick(pr.id, {
                            title: pr.title,
                            sourceBranch: pr.sourceBranch,
                            targetBranch: pr.targetBranch,
                            createrName: pr.createrName,
                          })
                        }
                      >
                        <ListItemAvatar>
                          <Avatar src={pr.createrAvatar} alt={pr.createrName} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={pr.title}
                          secondary={`${pr.createrName} • ${pr.sourceBranch} → ${pr.targetBranch}`}
                          sx={{ color: theme.palette.text.primary }}
                        />
                        <Chip label="Open" color="success" />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography
                    align="center"
                    sx={{ mt: 2, color: theme.palette.text.secondary }}
                  >
                    No open pull requests
                  </Typography>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="closed-prs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? (
                  renderSkeletonList()
                ) : closedPRs.length > 0 ? (
                  <List>
                    {closedPRs.map((pr) => (
                      <ListItem
                        key={pr.id}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={pr.createrAvatar} alt={pr.createrName} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={pr.title}
                          secondary={`${pr.createrName} • ${pr.sourceBranch} → ${pr.targetBranch}`}
                          sx={{ color: theme.palette.text.primary }}
                        />
                        <Chip
                          label={pr.status}
                          color={pr.status === "MERGED" ? "primary" : "error"}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography
                    align="center"
                    sx={{ mt: 2, color: theme.palette.text.secondary }}
                  >
                    No closed pull requests
                  </Typography>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export default ViewPullRequestsDialog;
