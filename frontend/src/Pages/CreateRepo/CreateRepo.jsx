import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
const CreateRepo = () => {
  const { currentUser, setCurrentUser } = useUserProfile();
  const [username, setUsername] = useState(currentUser.username);
  useEffect(() => {
    setUsername(JSON.parse(localStorage.getItem("_user"))["username"]);
    // console.log(currentUser);
  }, []);

  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
          `service/CreateRepoServlet`,
          repoInfo
        );
        navigate("/repositories");
        console.log(response.data);
        setLoading(false);
        setOpenSnackbar(true);
      } catch (error) {
        setLoading(false);
        setOpenSnackbar(false);
        setErrorSnackbar(true);
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
        <Typography variant="h5" fontWeight="bold">
          Create a New Repository
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Owner: <strong>{username}</strong>
        </Typography>

        <TextField
          label="Repository Name"
          variant="outlined"
          fullWidth
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          required
        />

        <TextField
          label="Description (Optional)"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

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
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleCreateRepo}
          disabled={!repoName.trim()}
        >
          Create Repository
        </Button>
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
