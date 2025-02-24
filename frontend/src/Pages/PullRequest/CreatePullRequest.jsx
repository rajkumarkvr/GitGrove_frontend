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
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";

const CreatePullRequest = ({
  defaultSourceBranch = "feature/new-login",
  defaultTargetBranch = "main",
  sourceBranches = [],
  targetBranches = [],
  onCreatePullRequest,
}) => {
  const theme = useTheme();
  const [sourceBranch, setSourceBranch] = useState(defaultSourceBranch);
  const [targetBranch, setTargetBranch] = useState(defaultTargetBranch);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onCreatePullRequest({ sourceBranch, targetBranch, title, description });
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
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Create Pull Request
      </Typography>

      <TextField
        label="Pull Request Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        variant="outlined"
        margin="normal"
      />

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={5}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="source-branch-label">Source Branch</InputLabel>
            <Select
              labelId="source-branch-label"
              value={sourceBranch}
              onChange={(e) => setSourceBranch(e.target.value)}
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

        {/* Arrow Icon */}
        <Grid item xs={2} textAlign="center">
          <ArrowForwardIcon
            sx={{ fontSize: 35, color: theme.palette.text.primary }}
          />
        </Grid>

        {/* Target Branch */}
        <Grid item xs={5}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="target-branch-label">Target Branch</InputLabel>
            <Select
              labelId="target-branch-label"
              value={targetBranch}
              onChange={(e) => setTargetBranch(e.target.value)}
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
        helperText="Provide a brief description of your changes for the reviewers."
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!title.trim() || !description.trim()}
        fullWidth
        sx={{ mt: 2 }}
      >
        Create Pull Request
      </Button>
    </Paper>
  );
};

export default CreatePullRequest;
