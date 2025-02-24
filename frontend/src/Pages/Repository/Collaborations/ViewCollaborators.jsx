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
import axiosInstance from "../../../axiosInstance";
import getCurrentUser from "../../../Contexts/getCurrentUser";

const ViewCollaboratorsDialog = ({ open, handleClose, repoName }) => {
  const theme = useTheme(); // Get the current theme mode
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchCollaborators = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(
            `/service/getcollaborators?reponame=${encodeURIComponent(
              repoName
            )}&ownername=${encodeURIComponent(getCurrentUser()?.username)}`
          );
          const response2 = await axiosInstance.get(
            `/service/getcollabrequests?reponame=${encodeURIComponent(
              repoName
            )}&ownername=${encodeURIComponent(getCurrentUser()?.username)}`
          );

          setCollaborators(response.data.users);
          setPendingRequests(response2.data.users);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      };
      fetchCollaborators();
    }
  }, [open, repoName]);

  // Function to render skeleton loaders
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
            primary={<Skeleton width="40%" />}
            secondary={<Skeleton width="60%" />}
          />
          {tabIndex === 1 && (
            <Skeleton variant="rectangular" width={60} height={24} />
          )}
        </ListItem>
      ))}
    </List>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {/* Animated Wrapper */}
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
          View Collaborators - {repoName}
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
            <Tab label="Collaborators" />
            <Tab label="Requests" />
          </Tabs>
        </Paper>

        {/* Content Section */}
        <DialogContent
          sx={{
            minHeight: "350px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <AnimatePresence mode="wait">
            {tabIndex === 0 ? (
              <motion.div
                key="collaborators"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? (
                  renderSkeletonList()
                ) : collaborators.length > 0 ? (
                  <List>
                    {collaborators.map((user) => (
                      <ListItem
                        key={user.id}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={user.avatar} alt={user.username} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={user.email}
                          sx={{ color: theme.palette.text.primary }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography
                    align="center"
                    sx={{ mt: 2, color: theme.palette.text.secondary }}
                  >
                    No collaborators found.
                  </Typography>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="requests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {loading ? (
                  renderSkeletonList(2)
                ) : pendingRequests.length > 0 ? (
                  <List>
                    {pendingRequests.map((user) => (
                      <ListItem
                        key={user.id}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={user.avatar} alt={user.username} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={user.email}
                          sx={{ color: theme.palette.text.primary }}
                        />
                        <Chip label="Pending" color="warning" />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography
                    align="center"
                    sx={{ mt: 2, color: theme.palette.text.secondary }}
                  >
                    No pending requests.
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

export default ViewCollaboratorsDialog;
