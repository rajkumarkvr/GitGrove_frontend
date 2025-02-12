import { Box, Typography, TextField, Button } from "@mui/material";

const ProfileSettings = () => {
  return (
    <Box>
      <Typography variant="h6">Profile Settings</Typography>
      <TextField label="Username" variant="outlined" fullWidth sx={{ my: 2 }} />
      <TextField label="Bio" variant="outlined" fullWidth sx={{ my: 2 }} />
      <Button variant="contained">Save Changes</Button>
    </Box>
  );
};

export default ProfileSettings;
