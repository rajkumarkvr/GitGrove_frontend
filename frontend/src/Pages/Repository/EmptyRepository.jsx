import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  Stack,
  useTheme,
  IconButton,
  Snackbar,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { motion } from "framer-motion";
import handleCopy from "../../CustomHooks/handleCopy";

const EmptyRepository = ({ repoName, sshUrl }) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState("");

  // Copy Function for Sections
  const handleCopySection = (text, message) => {
    handleCopy(text, setCopied);
    setCopiedMessage(message);
  };

  // Commands Data
  const newRepoCommands = [
    `echo "# ${repoName}" >> README.md`,
    "git init",
    "git add README.md",
    'git commit -m "first commit"',
    "git branch -M main",
    `git remote add origin ${sshUrl}`,
    "git push -u origin main",
  ].join("\n");

  const pushExistingRepoCommands = [
    `git remote add origin ${sshUrl}`,
    "git branch -M main",
    "git push -u origin main",
  ].join("\n");

  return (
    <Container
      maxWidth="md"
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        mt: 10,
        py: 4,
        px: 3,
        bgcolor:
          theme.palette.mode === "light" ? "background.paper" : "grey.900",
        borderRadius: 2,
        boxShadow: 3,
        textAlign: "center",
      }}
    >
      {/* Quick Setup */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 5, mb: 2 }}>
        Quick setup — if you’ve done this kind of thing before
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
      >
        <TextField
          size="small"
          variant="outlined"
          value={sshUrl}
          InputProps={{ readOnly: true }}
          sx={{ minWidth: "70%" }}
        />
        <IconButton
          onClick={() => handleCopySection(sshUrl, "SSH URL copied!")}
          color="primary"
        >
          <ContentCopyIcon />
        </IconButton>
      </Stack>

      {/* New Repository Commands */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>
        Create a new repository on the command line
      </Typography>

      <Box
        component={motion.div}
        initial={{ scale: 0.98 }}
        whileHover={{ scale: 1 }}
        sx={{
          bgcolor: theme.palette.mode === "light" ? "grey.100" : "grey.800",
          p: 2,
          borderRadius: 1,
          textAlign: "left",
          fontFamily: "monospace",
          mt: 1,
          overflowX: "auto",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: "0.875rem", whiteSpace: "pre-wrap" }}
        >
          {newRepoCommands}
        </Typography>
        <IconButton
          onClick={() =>
            handleCopySection(newRepoCommands, "New repo commands copied!")
          }
          color="primary"
          sx={{ float: "right" }}
        >
          <ContentCopyIcon />
        </IconButton>
      </Box>

      {/* Push Existing Repository */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>
        …or push an existing repository from the command line
      </Typography>

      <Box
        component={motion.div}
        initial={{ scale: 0.98 }}
        whileHover={{ scale: 1 }}
        sx={{
          bgcolor: theme.palette.mode === "light" ? "grey.100" : "grey.800",
          p: 2,
          borderRadius: 1,
          textAlign: "left",
          fontFamily: "monospace",
          mt: 1,
          overflowX: "auto",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: "0.875rem", whiteSpace: "pre-wrap" }}
        >
          {pushExistingRepoCommands}
        </Typography>
        <IconButton
          onClick={() =>
            handleCopySection(pushExistingRepoCommands, "Push commands copied!")
          }
          color="primary"
          sx={{ float: "right" }}
        >
          <ContentCopyIcon />
        </IconButton>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message={copiedMessage}
      />
    </Container>
  );
};

export default EmptyRepository;
