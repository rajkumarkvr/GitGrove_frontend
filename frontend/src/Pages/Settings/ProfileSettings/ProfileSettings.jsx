import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";
import { motion } from "framer-motion";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import getCurrentUser from "../../../Contexts/getCurrentUser";
import axiosInstance from "../../../axiosInstance";
import setCurrentUser from "../../../Contexts/setCurrentUser";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dye2p5i78/image/upload";
const UPLOAD_PRESET = "my_img_raj_007";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ProfileSettings = () => {
  const currentUser = getCurrentUser();
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [imageURL, setImageURL] = useState(currentUser?.profile_url || "");
  const [profileImage, setProfileImage] = useState(
    currentUser?.profile_url || ""
  );
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState({ username: "", email: "", global: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(""); // New error state for Snackbar

  // Upload Image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await axiosInstance.post(CLOUDINARY_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Uploaded Image URL:", response.data.secure_url);
      setImageURL(response.data.secure_url);
    } catch (error) {
      console.error("Image upload failed:", error);
      setErrorSnackbar("Failed to upload image. Try again!");
    }
  };

  // Handle Profile Image Change
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      uploadImageToCloudinary(file); // Upload the image before updating profile
    }
  };

  // Validate Inputs & Save Changes
  const handleSaveChanges = async () => {
    let newError = { username: "", email: "", password: "", global: "" };

    if (!username.trim()) newError.username = "Username cannot be empty!";
    if (!email.trim() || !emailRegex.test(email.trim()))
      newError.email = "Enter a valid email!";
    if (!password.trim()) newError.password = "Password cannot be empty!";

    setError(newError);

    // If validation fails, stop execution
    if (newError.username || newError.email || newError.password) return;

    setLoading(true);

    try {
      // **First API call: Login**
      const loginResponse = await axiosInstance.post("/auth/login", {
        identifier: currentUser.username,
        password: password,
      });
    } catch (error) {
      console.error("Login error:", error);
      setErrorSnackbar("Invalid password! Check your password.");
      setLoading(false);
      return; // Stop further execution if login fails
    }

    try {
      // **Second API call: Update user profile**
      const response = await axiosInstance.put(`/users/update/profile`, {
        oldusername: currentUser.username,
        oldemail: currentUser.email,
        username,
        email,
        profile_url: imageURL, // Ensure latest uploaded URL is used
      });

      if (response.status === 200) {
        console.log("Updated Profile:", response.data);
        setCurrentUser(response.data);
        setSuccessMessage("Profile updated successfully!");
      } else {
        throw new Error("Unexpected profile update response");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      console.log(error.response.data.error);

      setErrorSnackbar(
        error.response.data.error || "Invalid profile update response"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 5,
        p: 4,
        borderRadius: 4,
        textAlign: "center",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Profile Settings
      </Typography>

      {/* Profile Picture Box */}
      <Box
        sx={{ position: "relative", display: "inline-block", mb: 3 }}
        onMouseEnter={() => setShowCamera(true)}
        onMouseLeave={() => setShowCamera(false)}
      >
        <Avatar
          src={profileImage}
          alt="Profile"
          sx={{
            width: 120,
            height: 120,
            mx: "auto",
            transition: "0.3s ease-in-out",
          }}
          component={motion.div}
          whileHover={{ scale: 1.05 }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
          style={{ display: "none" }}
          id="upload-profile"
        />
        {showCamera && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", bottom: 0, right: 0 }}
          >
            <Tooltip title="Change Profile Picture">
              <IconButton
                component="label"
                htmlFor="upload-profile"
                sx={{
                  bgcolor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  p: 1,
                  borderRadius: "50%",
                  transition: "0.3s",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" },
                }}
              >
                <CameraAltIcon />
              </IconButton>
            </Tooltip>
          </motion.div>
        )}
      </Box>

      {/* Username Field */}
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={!!error.username}
        helperText={error.username}
      />

      {/* Email Field */}
      <TextField
        label="Email Address"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error.email}
        helperText={error.email}
      />

      <TextField
        label="Enter your password"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!error.password}
        helperText={error.password}
      />

      {/* Save Changes Button */}
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, py: 1 }}
        onClick={handleSaveChanges}
        disabled={loading}
        component={motion.button}
        whileHover={{ scale: 1.05 }}
      >
        {loading ? "Updating..." : "Save Changes"}
      </Button>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorSnackbar}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbar("")}
      >
        <Alert severity="error">{errorSnackbar}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default ProfileSettings;
