import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import axiosInstance from "../../../axiosInstance";
import AppLogo from "/images/Gitgrove.svg";

const CollaborationInvite = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const inviter = {
    username: queryParams.get("inviterUsername"),
    avatar:
      queryParams.get("inviterAvatar") || "https://i.pravatar.cc/150?img=8",
  };
  const invitedUser = {
    username: queryParams.get("inviteeUsername"),
    avatar:
      queryParams.get("inviteeAvatar") || "https://i.pravatar.cc/150?img=5",
    repoName: queryParams.get("repo"),
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // useEffect(() => {
  //   // Simulating initial page load animation
  //   setTimeout(() => setIsPageLoading(false), 1000);
  // }, [invitedUser, inviter]);

  const handleAcceptInvite = async () => {
    if (!invitedUser.username || !invitedUser.repoName || !inviter.username) {
      setError("Invalid or missing invitation details.");
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post("/service/accept-invite", {
        inviterUsername: inviter.username,
        inviteeUsername: invitedUser.username,
        repository: invitedUser.repoName,
      });
      setLoading(false);
      console.log(response.data);
      navigate(`/repo/${invitedUser.repoName}`);
    } catch (err) {
      console.error("Error accepting invite:", err);
      setError("Failed to accept the invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      {isPageLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress size={60} color="primary" />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* GitGrove Branding */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Link to="/">
              <motion.img
                style={{ cursor: "pointer" }}
                src={AppLogo}
                alt="GitGrove"
                width={80}
                height={80}
                whileHover={{ rotate: 10 }}
              />
            </Link>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography
                sx={{ cursor: "pointer" }}
                variant="h4"
                fontWeight="bold"
                mt={1}
                color="primary"
              >
                GitGrove
              </Typography>
            </Link>
            <Typography variant="subtitle1" color="text.secondary">
              Seamless Collaboration for Developers 🚀
            </Typography>
          </Box>

          {/* Invitation Card */}
          <Card
            sx={{
              mt: 4,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              boxShadow: 5,
              borderRadius: 3,
            }}
            component={motion.div}
            whileHover={{ scale: 1.02 }}
          >
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Collaboration Invitation 🎉
            </Typography>

            {/* Inviter Info */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={inviter.avatar}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Typography variant="h6">
                @{inviter.username} invited you to collaborate!
              </Typography>
            </Box>

            {/* Invitee Avatar */}
            <Avatar
              src={invitedUser.avatar}
              sx={{
                width: 80,
                height: 80,
                mb: 1,
                border: "4px solid #1976D2",
              }}
            />
            <Typography variant="h6" fontWeight="bold">
              @{invitedUser.username}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{ mt: 1, color: "text.secondary" }}
            >
              You have been invited to collaborate on{" "}
              <strong>{invitedUser.repoName}</strong>.
            </Typography>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            {/* Accept Invitation Button */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAcceptInvite}
                sx={{
                  mt: 3,
                  px: 4,
                  py: 1.2,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Accept Invitation"
                )}
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      )}
    </Container>
  );
};

export default CollaborationInvite;
