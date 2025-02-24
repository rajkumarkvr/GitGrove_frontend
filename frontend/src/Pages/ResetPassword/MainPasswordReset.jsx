import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import mailServerAxiosInstance from "../../mailServerAxiosInstance";

const MainPasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      const response = await mailServerAxiosInstance.post(
        "api/auth/reset-password",
        { token, password }
      );
      setMessage({ type: "success", text: response.data.message });
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to reset password",
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 5, p: 3, boxShadow: 2, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Reset Your Password
        </Typography>
        {message && <Alert severity={message.type}>{message.text}</Alert>}
        <TextField
          fullWidth
          label="New Password"
          type="password"
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          margin="normal"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleResetPassword}
        >
          Reset Password
        </Button>
      </Box>
    </Container>
  );
};

export default MainPasswordReset;
