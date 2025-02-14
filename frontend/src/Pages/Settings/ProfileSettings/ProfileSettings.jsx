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
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dye2p5i78/image/upload";

const UPLOAD_PRESET = "my_img_raj_007";

const ProfileSettings = () => {
  const currentUser = getCurrentUser();
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [profileImage, setProfileImage] = useState(
    currentUser?.profile_url || "/default-avatar.png"
  );
  const formData = new FormData();
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState({ username: "", email: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const uploadImageToCloudinary = async () => {
    try {
      axiosIns;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  };
  // Handle Profile Image Change
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
    }
  };

  // Validate Inputs & Save Changes
  const handleSaveChanges = () => {
    let newError = { username: "", email: "" };
    if (!username.trim()) newError.username = "Username cannot be empty!";
    if (!email.trim() || !email.includes("@"))
      newError.email = "Enter a valid email!";

    setError(newError);

    if (!newError.username && !newError.email) {
      setSuccessMessage("Profile updated successfully!");
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

      {/* Change Password Link */}
      <Box sx={{ mb: 2 }}>
        <Link href="/auth/reset-password" variant="body2">
          Change Password
        </Link>
      </Box>

      {/* Save Changes Button */}
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, py: 1 }}
        onClick={handleSaveChanges}
        component={motion.button}
        whileHover={{ scale: 1.05 }}
      >
        Save Changes
      </Button>

      {/* Success Snackbar Alert */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={2000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default ProfileSettings;
