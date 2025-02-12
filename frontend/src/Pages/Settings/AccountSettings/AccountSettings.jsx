import { Box, Typography, Button } from "@mui/material";

const AccountSettings = () => {
  return (
    <Box>
      <Typography variant="h6">Account Settings</Typography>
      <Button variant="contained" color="error">
        Delete Account
      </Button>
    </Box>
  );
};

export default AccountSettings;
