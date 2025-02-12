import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import axiosInstance from "../../axiosInstance";
const CreateRepo = () => {
  const [username, setUsername] = useState("Rajkumar");
  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCreateRepo = () => {
    console.log("Repository Created:", {
      username,
      repoName,
      description,
      visibility,
    });

    const createRepo = async () => {
      // username,
      // name: repoName,
      // description,
      // visibility,
      const response = await axiosInstance.post(
        `/CreateRepoServlet?username=${username}&repoName=${repoName}`,
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*", // This only works if the server allows it
          },
        }
      );
      if (response.data) {
        console.log(response.data);
        setOpenSnackbar(true); // Show success message
      } else {
        console.error(response.data.error);
        setOpenSnackbar(false); // Show error message
      }
    };
    createRepo();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 4,
        mt: 4,
        display: "flex",
        flexDirection: "column",

        gap: 2,
      }}
    >
      {/* Title */}
      <Typography variant="h5" fontWeight="bold">
        Create a New Repository
      </Typography>

      {/* Owner */}
      <Typography variant="body1" color="text.secondary">
        Owner: <strong>{username}</strong>
      </Typography>

      {/* Repository Name Input */}
      <TextField
        label="Repository Name"
        variant="outlined"
        fullWidth
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
      />

      {/* Description Input */}
      <TextField
        label="Description (Optional)"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Visibility Options */}
      <FormControl>
        <FormLabel>Repository Visibility</FormLabel>
        <RadioGroup
          row
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          <FormControlLabel value="public" control={<Radio />} label="Public" />
          <FormControlLabel
            value="private"
            control={<Radio />}
            label="Private"
          />
        </RadioGroup>
      </FormControl>

      {/* Create Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleCreateRepo}
        disabled={!repoName.trim()}
      >
        Create Repository
      </Button>

      {/* Snackbar Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          🎉 Repository "{repoName}" created successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreateRepo;
