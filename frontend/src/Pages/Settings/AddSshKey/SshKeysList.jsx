import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  IconButton,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../../axiosInstance";
import getCurrentUser from "../../../Contexts/getCurrentUser";

const SshKeysList = ({ success }) => {
  const theme = useTheme();
  const [sshKeys, setSshKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingKeyId, setRemovingKeyId] = useState(null);
  const [keyRemoved, setKeyRemoved] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchSshKeys = async () => {
      try {
        const response = await axiosInstance.get(`/service/ssh/keys`, {
          params: {
            username: currentUser?.username,
          },
        });
        setSshKeys(response.data.keys);
      } catch (error) {
        console.error("Error fetching SSH keys:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSshKeys();
  }, [success, removingKeyId]);

  const handleRemoveKey = async (keyId) => {
    setRemovingKeyId(keyId);
    try {
      setLoading(true);
      await axiosInstance.delete(`/service/ssh/delete-key/`, {
        params: {
          id: keyId,
          username: currentUser?.username,
        },
      });
      setKeyRemoved((prev) => !prev);
      setSshKeys(sshKeys.filter((key) => key.id !== keyId));
    } catch (error) {
      console.error("Error removing SSH key:", error);
    } finally {
      setLoading(false);
      setRemovingKeyId(null);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Your SSH Keys
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Manage your SSH keys here. You can remove old keys if necessary
        </Typography>
      </motion.div>

      {loading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      ) : sshKeys == null || sshKeys == undefined || sshKeys == [] ? (
        <Typography color="text.secondary" textAlign="center">
          No SSH keys found. Add a new SSH key
        </Typography>
      ) : (
        <List>
          {sshKeys &&
            sshKeys.length > 0 &&
            sshKeys.map((key) => (
              <motion.div
                key={key.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <ListItem
                  sx={{
                    backgroundColor: theme.palette.grey[900],
                    borderRadius: 1,
                    mb: 1,
                    p: 2,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          color: theme.palette.grey[100],
                          fontFamily: "monospace",
                          wordBreak: "break-all",
                        }}
                        variant="body2"
                      >
                        {key.publicKey}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{ color: theme.palette.grey[400] }}
                        variant="caption"
                      >
                        {key.description} - Added on{" "}
                        {new Date(key.createdAt).toLocaleString()}
                      </Typography>
                    }
                  />
                  <IconButton
                    onClick={() => handleRemoveKey(key.id)}
                    disabled={removingKeyId === key.id}
                    sx={{ color: theme.palette.error.main }}
                  >
                    {removingKeyId === key.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </ListItem>
              </motion.div>
            ))}
        </List>
      )}
    </Paper>
  );
};

export default SshKeysList;
