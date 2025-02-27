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
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import getCurrentUser from "../../../Contexts/getCurrentUser";
import clearCookieAndCurrentUser from "../../../CustomHooks/clearCookie";
import axiosInstance from "../../../axiosInstance";
import getToken from "../../../CustomHooks/getAuthToken";
import Loading from "../../../Components/Loading";
import ActiveSessions from "./ActiveSessions";

const AccountSettings = () => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleLogout = async () => {
    setLoading(true);
    const token = getToken();
    try {
      await axiosInstance.post(`/clearsession?expiredToken=${token}`);
      clearCookieAndCurrentUser();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {loading && <Loading />}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 4,
          flexWrap: "nowrap",
          mt: 5,
          px: 2,
          "@media (max-width: 900px)": {
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        <Paper
          elevation={12}
          sx={{
            width: "40%",
            minWidth: 350,
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            boxShadow: "0px 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Avatar
              src={getCurrentUser()?.profile_url}
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                bgcolor: "primary.main",
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 60, color: "white" }} />
            </Avatar>
          </motion.div>

          <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
            Hello, {getCurrentUser()?.username}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Manage your account settings here
          </Typography>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2, py: 1.5 }}
              startIcon={<LogoutIcon />}
              onClick={() => setLogoutDialogOpen(true)}
            >
              Log out
            </Button>
          </motion.div>

          {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{ py: 1.5 }}
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </motion.div> */}
        </Paper>

        <Paper
          elevation={12}
          sx={{
            width: "50%",
            minWidth: 700,
            p: 4,
            borderRadius: 3,
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            boxShadow: "0px 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          <ActiveSessions />
        </Paper>
      </Box>
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to log out of this session?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Deleting your account is **irreversible**. All your data will be
            permanently lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => setDeleteDialogOpen(false)} color="error">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default AccountSettings;
