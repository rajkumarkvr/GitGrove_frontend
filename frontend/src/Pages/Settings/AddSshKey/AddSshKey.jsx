import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import getCurrentUser from "../../../Contexts/getCurrentUser";
import axiosInstance from "../../../axiosInstance";
import SshKeysList from "./SshKeysList";

const AddSshKey = () => {
  const theme = useTheme();
  const [sshKey, setSshKey] = useState("");
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const [onError, setOnError] = useState("");
  const currentUser = getCurrentUser();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const sshSteps = [
    {
      command: "ssh-keygen -t ed25519 -C 'your_email@example.com'",
      description:
        "Generate a modern Ed25519 SSH key pair. Press Enter to accept defaults (no passphrase).",
    },
    {
      command: "cat ~/.ssh/id_ed25519.pub",
      description: "Display your public key to copy and paste above.",
    },
  ];

  const validateSshKey = (key) => {
    if (!key.trim()) return "SSH public key is required.";
    if (!key.match(/^(ssh-ed25519|ssh-rsa)\s+[A-Za-z0-9+/=]+/)) {
      return "Invalid SSH public key format. It should start with 'ssh-ed25519' or 'ssh-rsa'.";
    }
    return "";
  };

  const handleCloseSnackbar = () => setOnError("");

  const handleAddSSHKey = () => {
    if (sshKey.trim() !== "") {
      setLoading(true);
      const payload = {
        username: currentUser?.username,
        publicKey: sshKey,
        description: description,
      };
      console.table(payload);
      const addKey = async () => {
        try {
          await axiosInstance.post("/service/ssh/add-key", payload);
          setSshKey("");
          setDescription("");
          setSuccess((prev) => !prev);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setOnError(error.response?.data?.message || "Error adding SSH key");
        }
      };
      addKey();
    }
  };

  const handleCopyCommands = (steps) => {
    const textToCopy = steps.map((step) => step.command).join("\n");
    if (window.navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed: ", err);
      } finally {
        document.body.removeChild(textarea);
      }
    }

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      display="flex"
      gap={10}
      p={2}
      sx={{
        width: "100%",
        height: "100%",
        alignItems: "flex-start",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          padding: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          minWidth: "95%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Add SSH Key
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Secure your connection with an SSH key. Follow the steps below to
            generate one.
          </Typography>
        </motion.div>
        <Box mb={3}>
          <TextField
            label="SSH Public Key"
            placeholder="Paste your SSH public key here (e.g., ssh-ed25519 AAA...)"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={sshKey}
            onChange={(e) => {
              setSshKey(e.target.value);
              setOnError(validateSshKey(e.target.value));
            }}
            error={!!onError}
            helperText={onError}
            required
          />
        </Box>
        <Box mb={3}>
          <TextField
            label="Description"
            placeholder="e.g., Work laptop, Home PC"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
        {loading && (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 4, width: "100%" }}
          disabled={!sshKey.trim() || loading}
          onClick={handleAddSSHKey}
        >
          Add SSH Key
        </Button>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          How to Generate an SSH Key
        </Typography>
        <List dense>
          {sshSteps.map((step, index) => (
            <motion.div key={index} whileHover={{ scale: 1.02 }}>
              <ListItem
                sx={{
                  backgroundColor: theme.palette.grey[900],
                  borderRadius: 1,
                  mb: 1,
                  p: 1,
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        color: theme.palette.grey[100],
                        fontFamily: "monospace",
                      }}
                    >
                      {step.command}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ color: theme.palette.grey[400] }}>
                      {step.description}
                    </Typography>
                  }
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
        <Button
          variant="outlined"
          startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
          onClick={() => handleCopyCommands(sshSteps)}
          sx={{ width: "100%", mb: 3 }}
        >
          {copied ? "Copied!" : "Copy Ed25519 Commands"}
        </Button>
        <Snackbar
          open={!!onError}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {onError}
          </Alert>
        </Snackbar>
      </Paper>

      <Box flex={1} minWidth="75%">
        <SshKeysList success={success} />
      </Box>
    </Box>
  );
};

export default AddSshKey;
