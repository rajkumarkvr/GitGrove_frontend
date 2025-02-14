import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
} from "@mui/material";
import { motion } from "framer-motion";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import getCurrentUser from "../../../Contexts/getCurrentUser";
// Smooth Dialog Animation
const Transition = Slide;

const AccountSettings = () => {
  const [open, setOpen] = useState(false);

  // Open Delete Confirmation
  const handleOpen = () => {
    setOpen(true);
  };

  // Close Delete Confirmation
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 400,
          mx: "auto",
          mt: 5,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          bgcolor: "background.default",
          boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        {/* Avatar and Greeting */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Avatar
            src={getCurrentUser().profile_url}
            sx={{ width: 80, height: 80, mx: "auto", bgcolor: "primary.main" }}
          >
            <AccountCircleIcon sx={{ fontSize: 60, color: "white" }} />
          </Avatar>
        </motion.div>
        <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
          Hello, {getCurrentUser().username}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Manage your account settings here.
        </Typography>

        {/* Logout Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2, py: 1.5 }}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </motion.div>

        {/* Delete Account Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{ py: 1.5 }}
            startIcon={<DeleteIcon />}
            onClick={handleOpen}
          >
            Delete Account
          </Button>
        </motion.div>

        {/* Confirmation Dialog */}
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
        >
          <DialogTitle>{"Are you sure?"}</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              Deleting your account is irreversible.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="error">
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  );
};

export default AccountSettings;
