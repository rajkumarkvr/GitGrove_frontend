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
import { useUserProfile } from "../../Contexts/UserContext";
import Loading from "../../Components/Loading";
const CreateRepo = () => {
  const [username, setUsername] = useState("Rajkumar");
  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useUserProfile();
  const handleCreateRepo = () => {
    console.log("Repository Created:", {
      username,
      repoName,
      description,
      visibility,
    });

    const createRepo = async () => {
      setLoading(true);

      const repoInfo = {
        // username: currentUser.username,
        username,
        repoName,
        description,
        visibility,
      };
      // username,
      // name: repoName,
      // description,
      // visibility,
      try {
        const response = await axiosInstance.post(
          `/CreateRepoServlet`,
          repoInfo
        );

        console.log(response.data);
        setLoading(false);
        setOpenSnackbar(true); // Show success message
      } catch (error) {
        setLoading(false);
        setOpenSnackbar(false); // Show error message
        setErrorSnackbar(true); // Show error message
        console.log(error);
      }
      setRepoName("");
      setDescription("");
    };
    createRepo();
  };

  return (
    <>
      {loading && <Loading />}
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
          required
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
            <FormControlLabel
              value="public"
              control={<Radio />}
              label="Public"
            />
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
        {/* Snackbar Notification */}
        <Snackbar
          open={errorSnackbar}
          autoHideDuration={2000}
          onClose={() => setErrorSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setErrorSnackbar(false)}
            severity="warning"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Repository already exists!
          </Alert>
        </Snackbar>
      </Paper>
    </>
  );
};

export default CreateRepo;
