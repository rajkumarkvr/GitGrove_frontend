import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Link,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import validateRegistrationData from "./registerValidate";
import axiosInstance from "../../axiosInstance";
import useLocalStorage from "../../CustomHooks/OwnLocalStorage";
import Loading from "../../Components/Loading";
import { setAuthToken } from "../../CustomHooks/setToken";
import getToken from "../../CustomHooks/getAuthToken";
import setCurrentUser from "../../Contexts/setCurrentUser";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [storedValue, setStoredValue] = useLocalStorage("_user", {});
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState(false);
  const navigate = useNavigate();
  // console.log(getToken());
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    if (validateRegistrationData(formData, setErrors)) {
      // Send data to backend
      const registerUser = async () => {
        setLoading(true);
        const user = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          avator: "",
        };
        try {
          const response = await axiosInstance.post("/auth/register", user);
          console.log(response.data);
          setCurrentUser(response.data.user);
          setAuthToken(getToken());
          setLoading(false);
          navigate("/repositories");
        } catch (error) {
          console.log(error.response.data.error);
          setLoading(false);
          setErrors({ global: error.response.data.error });
        }
      };
      registerUser();
    }

    console.log("Registered Data:", formData);
  };

  return (
    <Container maxWidth="xs">
      {loading && <Loading />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 10,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            marginBottom: "20px",
          }}
        >
          Create Account
        </Typography>

        <TextField
          label="Username"
          name="username"
          fullWidth
          onChange={handleChange}
        />
        {errors.username && <Alert severity="error">{errors.username}</Alert>}

        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          onChange={handleChange}
        />
        {errors.email && <Alert severity="error">{errors.email}</Alert>}

        <TextField
          label="Password"
          name="password"
          fullWidth
          sx={{ mb: 2 }}
          onChange={handleChange}
          type={password ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setPassword(!password)}>
                {password ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        {errors.password && <Alert severity="error">{errors.password}</Alert>}

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          // variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          onChange={handleChange}
          type={showConfirmPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />

        {errors.confirmPassword && (
          <Alert severity="error">{errors.confirmPassword}</Alert>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          fullWidth
        >
          Sign Up
        </Button>
        {errors.global && <Alert severity="error">{errors.global}</Alert>}
        <Typography variant="body2" sx={{ mt: 1 }}>
          Already a user?{" "}
          <Link sx={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
