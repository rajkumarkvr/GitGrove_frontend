import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import validateLoginData from "./loginValidate";
import useLocalStorage from "../../CustomHooks/OwnLocalStorage";
import Loading from "../../Components/Loading";
import axiosInstance from "../../axiosInstance";
import { setAuthToken } from "../../CustomHooks/setToken";
import getToken from "../../CustomHooks/getAuthToken";
import setCurrentUser from "../../Contexts/setCurrentUser";
const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [storedValue, setStoredValue] = useLocalStorage("_user", {});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    console.log("User Login:", credentials);
    setLoading(true);
    if (validateLoginData(credentials, setErrors)) {
      const loginUser = async () => {
        const user = {
          identifier: credentials.identifier,
          password: credentials.password,
        };
        try {
          const response = await axiosInstance.post("/auth/login", user);

          console.log(response.data);
          setCurrentUser(response.data.user);
          setAuthToken(getToken());
          setLoading(false);
          navigate("/");
        } catch (error) {
          setLoading(false);
          console.log(error);
          //   console.log(error.response);
          //   if (error.response.status === 400) {
          //     setErrors({ global: "Invalid login" });
          //   } else {
          //     console.error("Error registering user:", error);
          //     setErrors({
          //       global: "Failed to register user. Please try again later.",
          //     });
          //   }
        }
      };
      loginUser();
    }
  };
  return (
    <Container maxWidth="xs">
      {loading && <Loading />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Welcome Back!
        </Typography>

        <TextField
          label="Username or Email"
          name="identifier"
          fullWidth
          onChange={handleChange}
        />
        {errors.identifier && (
          <Alert severity="error">{errors.identifier}</Alert>
        )}
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          onChange={handleChange}
        />
        {errors.password && <Alert severity="error">{errors.password}</Alert>}
        {errors.global && <Alert severity="error">{errors.global}</Alert>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          fullWidth
        >
          Login
        </Button>

        <Link
          sx={{ alignSelf: "flex-end", cursor: "pointer", fontSize: "0.9rem" }}
          onClick={() => navigate("/auth/reset-password")}
        >
          Forgot Password?
        </Link>

        <Typography variant="body2" sx={{ mt: 1 }}>
          New user?
          <Link
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Create an account
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
