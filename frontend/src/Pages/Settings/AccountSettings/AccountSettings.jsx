import { Box, Typography, Button } from "@mui/material";

const AccountSettings = () => {
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
        <Typography variant="h6">Account Settings</Typography>
        <Button variant="contained" color="primary">
          Logout
        </Button>

        <Button variant="contained" color="error">
          Delete Account
        </Button>
      </Box>
    </>
  );
};

export default AccountSettings;
