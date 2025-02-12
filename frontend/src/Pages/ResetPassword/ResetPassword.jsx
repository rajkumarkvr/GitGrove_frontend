import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
  Alert,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import mailServerAxiosInstance from "../../mailServerAxiosInstance";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isCaptchaVerified, setCaptchaVerified] = useState(false);
  const [message, setMessage] = useState(null); // State to store messages
  const navigate = useNavigate();

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
    }
  };

  const handleReset = async () => {
    console.log("Password Reset Request Sent for:", email);
    try {
      const response = await mailServerAxiosInstance.post(
        "/api/auth/request-reset",
        {
          email: email,
        }
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 5,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Reset Your Password
        </Typography>
        <Typography variant="body2">
          Enter your email address below, and we'll send you a link to reset
          your password.
        </Typography>

        {message && (
          <Alert severity={message.type} sx={{ mb: 1 }}>
            {message.text}
          </Alert>
        )}

        <TextField
          label="Email Address"
          type="email"
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Google reCAPTCHA */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <ReCAPTCHA
            sitekey="6LcAltQqAAAAAB8GOUZxpHz_3U16WAu38lJI5fBJ"
            onChange={handleCaptchaChange}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleReset}
          disabled={!isCaptchaVerified || !email.trim()}
          fullWidth
        >
          Send Password Reset Link
        </Button>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Remember your password?{" "}
          <Link sx={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
            Login here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default ResetPassword;
