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
  Box,
  Paper,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../axiosInstance";

// Sample Data with Better Image URLs
const collaborators = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/100?img=10",
  },
  {
    id: 2,
    username: "alice_smith",
    email: "alice@example.com",
    avatar: "https://i.pravatar.cc/100?img=20",
  },
  {
    id: 3,
    username: "michael_brown",
    email: "michael@example.com",
    avatar: "https://i.pravatar.cc/100?img=30",
  },
  {
    id: 4,
    username: "sophia_white",
    email: "sophia@example.com",
    avatar: "https://i.pravatar.cc/100?img=40",
  },
];

const pendingRequests = [
  {
    id: 5,
    username: "emily_jones",
    email: "emily@example.com",
    avatar: "https://i.pravatar.cc/100?img=50",
  },
  {
    id: 6,
    username: "robert_wilson",
    email: "robert@example.com",
    avatar: "https://i.pravatar.cc/100?img=60",
  },
];

const ViewCollaboratorsDialog = ({ open, handleClose, repoName }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  //   const [collaborators, setCollaborators] = useState([]);
  //   const [pendingRequests, setPendingRequests] = useState([]);
  const dialogContentStyle = {
    minHeight: "350px",
    display: "flex",
    flexDirection: "column",
  };

  // useEffect(() => {
  //   if (open) {
  //     const fetchCollaborators = async () => {
  //       setLoading(true);
  //       // try {
  //       //   setLoading(true);
  //       //   const response = await axiosInstance.get(
  //       //     /service/repository/${repoName}/collaborators
  //       //   );
  //       //   setCollaborators(response.data.active);
  //       //   setPendingRequests(response.data.requests);
  //       //   setLoading(false);
  //       // } catch (err) {
  //       //   console.log(err);
  //       //   setLoading(false);
  //       // }
  //     };
  //     fetchCollaborators();
  //   }
  // }, [open, repoName]);
  useEffect(() => {
    if (open) {
      setLoading(true);
      setTimeout(() => setLoading(false), 10000);
    }
  }, [open]);

  // Function to render skeleton loaders
  const renderSkeletonList = (numItems = 4) => (
    <List>
      {Array.from({ length: numItems }).map((_, index) => (
        <ListItem key={index} sx={{ borderBottom: "1px solid #ddd" }}>
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
            backgroundColor: "#f5f5f5",
          }}
        >
          View Collaborators - {repoName}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Tab Navigation */}
        <Paper sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": { fontWeight: "bold" },
              backgroundColor: "#fff",
            }}
          >
            <Tab label="Collaborators" />
            <Tab label="Requests" />
          </Tabs>
        </Paper>

        {/* Content Section */}
        <DialogContent sx={dialogContentStyle}>
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
                        sx={{ borderBottom: "1px solid #ddd" }}
                      >
                        <ListItemAvatar>
                          <Avatar src={user.avatar} alt={user.username} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={user.email}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography align="center" sx={{ mt: 2, color: "gray" }}>
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
                        sx={{ borderBottom: "1px solid #ddd" }}
                      >
                        <ListItemAvatar>
                          <Avatar src={user.avatar} alt={user.username} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={user.email}
                        />
                        <Chip label="Pending" color="warning" />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography align="center" sx={{ mt: 2, color: "gray" }}>
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
