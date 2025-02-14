import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import validateRegistrationData from "./registerValidate";
import axiosInstance from "../../axiosInstance";
import useLocalStorage from "../../CustomHooks/OwnLocalStorage";
import Loading from "../../Components/Loading";

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
  const navigate = useNavigate();

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
        };
        try {
          const response = await axiosInstance.post("/auth/register", user);
          console.log(response.data);
          setStoredValue(response.data.user);
          setLoading(false);
          navigate("/");
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
          type="password"
          fullWidth
          onChange={handleChange}
        />

        {errors.password && <Alert severity="error">{errors.password}</Alert>}
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          onChange={handleChange}
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
            Login here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
