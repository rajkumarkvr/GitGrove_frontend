import { useTheme } from "@mui/material/styles";
import {
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import BackLink from "../../Components/BackLink";

const CreatePullRequest = ({
  defaultSourceBranch = "feature/new-login",
  defaultTargetBranch = "main",
  sourceBranches = [],
  targetBranches = [],
  onCreatePullRequest,
  username,
  reponame,
  loading,
  created,
  setCreated,
}) => {
  const theme = useTheme();
  const [sourceBranch, setSourceBranch] = useState(defaultSourceBranch);
  const [targetBranch, setTargetBranch] = useState(defaultTargetBranch);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bothSame, setBothSame] = useState(false);

  const handleSubmit = () => {
    if (title.trim() && description.trim() && !bothSame) {
      onCreatePullRequest({ sourceBranch, targetBranch, title, description });
      setTitle("");
      setDescription("");
      setSourceBranch(defaultSourceBranch);
      setTargetBranch(defaultTargetBranch);
    }
  };

  // Function to check if branches are the same
  const handleBranchChange = (branch, type) => {
    if (type === "source") {
      setSourceBranch(branch);
      setBothSame(branch === targetBranch);
    } else {
      setTargetBranch(branch);
      setBothSame(branch === sourceBranch);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: theme.spacing(5),
        backgroundColor: theme.palette.background.paper,
        maxWidth: 800,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <BackLink to={`/repo/${username}/${reponame}`} />
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Create Pull Request for {username}/ {reponame}
      </Typography>

      <TextField
        label="Pull Request Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        variant="outlined"
        margin="normal"
        required
      />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={5}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel id="source-branch-label">Source Branch</InputLabel>
            <Select
              labelId="source-branch-label"
              value={sourceBranch}
              onChange={(e) => handleBranchChange(e.target.value, "source")}
              label="Source Branch"
            >
              {sourceBranches.map((branch) => (
                <MenuItem key={branch} value={branch}>
                  {branch}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={2} textAlign="center">
          <ArrowForwardIcon
            sx={{ fontSize: 35, color: theme.palette.text.primary }}
          />
        </Grid>
        <Grid item xs={5}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel id="target-branch-label">Target Branch</InputLabel>
            <Select
              labelId="target-branch-label"
              value={targetBranch}
              onChange={(e) => handleBranchChange(e.target.value, "target")}
              label="Target Branch"
            >
              {targetBranches.map((branch) => (
                <MenuItem key={branch} value={branch}>
                  {branch}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TextField
        label="Description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        variant="outlined"
        margin="normal"
        helperText="Provide a brief description of your changes for the reviewers"
        required
      />

      {/* Snackbar for branch conflict */}
      <Snackbar
        open={bothSame}
        autoHideDuration={2000}
        message="Both branches cannot be the same!"
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
          },
        }}
      />

      <Snackbar
        open={created}
        autoHideDuration={2000}
        onClose={() => setCreated(false)}
        message="Pull Request created!"
      />

      {loading && (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!title.trim() || !description.trim() || loading || bothSame}
        fullWidth
        sx={{ mt: 2 }}
      >
        Create Pull Request
      </Button>
    </Paper>
  );
};

export default CreatePullRequest;
