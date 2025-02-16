import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const Loading = ({ message = "Loading...", maxHeight = "100vh" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: maxHeight,
        gap: 2,
      }}
    >
      <CircularProgress size={60} color="primary" />
      <Typography variant="h6" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
