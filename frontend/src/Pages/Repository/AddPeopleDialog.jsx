import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  IconButton,
  InputAdornment,
  Box,
  Chip,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import axiosInstance from "../../axiosInstance";
import getCurrentUser from "../../Contexts/getCurrentUser";
import Loading from "../../Components/Loading";

const AddPeopleDialog = ({
  open,
  handleClose,
  repoName,
  handleAddToRepository,
  loading,
  success,
  setSuccess,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const theme = useTheme();


  // Handle user selection
  const handleUserSelect = (user) => {
    if (user.isRequested) return; // Prevent selection for requested users

    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleSearchQuery = (searchQuery) => {
    setSearchQuery(searchQuery);
    if (!searchQuery.trim() || searchQuery.length < 0) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      try {
        console.log("Querying...");
        const response = await axiosInstance.get(
          `/service/findpeople?username=${
            getCurrentUser()?.username
          }&searchterm=${searchQuery}&reponame=${repoName}`
        );

        setUsers(response.data.users);
        console.log(response.data.users);
      } catch (err) {
        console.log(err);
      }
    };

    searchUsers();
  };

  // Show animation when success is true
  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleClose();
        setSuccess(false);
      }, 2000);
    }
  }, [success]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setUsers([]);
        setSelectedUsers([]);
        setSearchQuery("");
        handleClose();
      }}
      maxWidth="sm"
      fullWidth
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
            color: theme.palette.text.primary,
          }}
        >
          Add people to {repoName}
          <IconButton
            onClick={handleClose}
            sx={{ color: theme.palette.text.primary }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "400px",
            overflow: "hidden",
          }}
        >
          {/* Show success animation */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Invitation Sent Successfully! 🎉
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hide everything when success is true */}
          {!showSuccess && (
            <>
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  background: theme.palette.background.paper,
                  zIndex: 10,
                  pb: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  Search by username, email
                </Typography>

                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Find people"
                  value={searchQuery}
                  onChange={(e) => handleSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    input: { color: theme.palette.text.primary },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: theme.palette.divider },
                    },
                  }}
                />
              </Box>

              {loading && <Loading />}

              <List sx={{ maxHeight: "250px", overflowY: "auto" }}>
                {users &&
                  users.length > 0 &&
                  users.map((user) => {
                    const isSelected = selectedUsers.some(
                      (u) => u.id === user.id
                    );

                    let label = null;
                    if (user.isRequested) {
                      label =
                        user.status === "ACCEPTED"
                          ? "Already a Collaborator"
                          : "Request Sent";
                    }

                    return (
                      <ListItem
                        key={user.id}
                        sx={{
                          transition: "0.3s",
                          "&:hover": {
                            backgroundColor: user.isRequested
                              ? "transparent"
                              : theme.palette.action.hover,
                          },
                          cursor: user.isRequested ? "default" : "pointer",
                          opacity: user.isRequested ? 0.6 : 1,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={user.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={user.email}
                        />

                        {label ? (
                          <Chip label={label} color="warning" />
                        ) : (
                          <IconButton
                            color={isSelected ? "success" : "primary"}
                            onClick={() => handleUserSelect(user)}
                          >
                            {isSelected ? (
                              <CheckCircleIcon />
                            ) : (
                              <PersonAddIcon />
                            )}
                          </IconButton>
                        )}
                      </ListItem>
                    );
                  })}
              </List>
            </>
          )}
        </DialogContent>

        {!showSuccess && (
          <DialogActions>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSearchQuery("");
                handleAddToRepository(selectedUsers);
                setUsers([]);
                setSelectedUsers([]);
              }}
              color="success"
              variant="contained"
              disabled={selectedUsers.length === 0}
            >
              Add to Repository
            </Button>
          </DialogActions>
        )}
      </motion.div>
    </Dialog>
  );
};

export default AddPeopleDialog;
