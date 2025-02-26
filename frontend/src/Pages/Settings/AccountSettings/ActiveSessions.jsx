import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Android as AndroidIcon,
  Apple as AppleIcon,
  LaptopWindows as WindowsIcon,
  Computer as LinuxIcon,
  PhoneIphone as iOSIcon,
  Help as UnknownIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { AiFillChrome, AiFillIeCircle } from "react-icons/ai";
import { FaEdge, FaSafari, FaFirefoxBrowser } from "react-icons/fa";
import getToken from "../../../CustomHooks/getAuthToken";
import axiosInstance from "../../../axiosInstance";
import getCurrentUser from "../../../Contexts/getCurrentUser";

// OS Icons mapping
const osIcons = {
  Windows: <WindowsIcon />,
  macOS: <AppleIcon />,
  Linux: <LinuxIcon />,
  Android: <AndroidIcon />,
  iOS: <iOSIcon />,
  "Unknown OS": <UnknownIcon />,
};

// Browser Icons mapping
const browserIcons = {
  "Google Chrome": <AiFillChrome size={24} />,
  "Mozilla Firefox": <FaFirefoxBrowser size={24} />,
  "Apple Safari": <FaSafari size={24} />,
  "Internet Explorer": <AiFillIeCircle size={24} />,
  "Microsoft Edge": <FaEdge size={24} />,
  "Unknown Browser": <FaEdge size={24} />,
};

function timeAgo(previousDate) {
  const currentDateObj = new Date();
  const previousDateObj = new Date(previousDate);

  const difference = currentDateObj.getTime() - previousDateObj.getTime();
  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return "just now";
  }
}
const ActiveSessions = () => {
  const [sessions, setSessions] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(getToken());
  const [selectedSession, setSelectedSession] = useState(null);
  const [logoutSession, setLogoutSession] = useState(null);
  const theme = useTheme();
  const fetchSessions = async () => {
    try {
      const response = await axiosInstance.get(
        `/service/getactivesessions?userid=${getCurrentUser()?.username}`
      );
      let fetchedSessions = response.data.sessions || [];

      setCurrentSessionId(getToken());

      fetchedSessions = [...fetchedSessions].sort((a, b) =>
        a.sessionid === currentSessionId ? -1 : 1
      );

      setSessions(fetchedSessions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = (session, event) => {
    event.stopPropagation();
    setLogoutSession(session);
  };

  useEffect(() => {
    fetchSessions();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSessions();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const confirmLogout = async () => {
    if (!logoutSession) return;

    try {
      await axiosInstance.post(
        `/service/logoutsession?sessionid=${logoutSession.sessionid}`
      );

      setSessions((prevSessions) =>
        prevSessions.filter((s) => s.sessionid !== logoutSession.sessionid)
      );
      setLogoutSession(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        Active Sessions
      </Typography>

      {sessions === null ? (
        <Typography>Loading...</Typography>
      ) : sessions.length === 0 ? (
        <Typography align="center">No active sessions</Typography>
      ) : (
        sessions.map((session) => (
          <motion.div
            key={session.sessionid}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                mb: 2,
                border:
                  session.sessionid === currentSessionId
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                background:
                  session.sessionid === currentSessionId
                    ? theme.palette.action.selected
                    : theme.palette.background.default,
                cursor: "pointer",
                "&:hover": { background: theme.palette.action.hover },
              }}
              onClick={() => setSelectedSession(session)}
            >
              <Tooltip title="Device OS">
                <Avatar sx={{ mr: 2 }}>
                  {osIcons[session.os_browser.split(" - ")[0]] || (
                    <UnknownIcon />
                  )}
                </Avatar>
              </Tooltip>

              <Tooltip title="Browser">
                <Avatar sx={{ mr: 2 }}>
                  {browserIcons[session.os_browser.split(" - ")[1]] || (
                    <UnknownIcon />
                  )}
                </Avatar>
              </Tooltip>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">
                  {session.city_country}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {timeAgo(session.startedTime)}
                </Typography>
              </CardContent>

              {session.sessionid === currentSessionId ? (
                <Chip
                  label="Current Session"
                  color="primary"
                  sx={{ fontWeight: "bold", mr: 1 }}
                />
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  onClick={(event) => handleLogout(session, event)}
                >
                  Logout
                </Button>
              )}
            </Card>
          </motion.div>
        ))
      )}

      {/* Session Details Dialog */}
      <Dialog
        open={Boolean(selectedSession)}
        onClose={() => setSelectedSession(null)}
      >
        <DialogTitle>Session Details</DialogTitle>
        <DialogContent>
          {selectedSession && (
            <>
              <Typography variant="body1">
                <strong>Device - </strong>{" "}
                {selectedSession.os_browser.split(" - ")[0]}
              </Typography>
              <Typography variant="body1">
                <strong>Browser - </strong>{" "}
                {selectedSession.os_browser.split(" - ")[1]}
              </Typography>
              <Typography variant="body1">
                <strong>Location- </strong>{" "}
                {selectedSession.city_country || "No Location"}
              </Typography>
              <Typography variant="body1">
                <strong>IP Address- </strong>{" "}
                {selectedSession.ipaddress || "No IP Address"}
              </Typography>
              <Typography variant="body1">
                <strong>Last Active - </strong>{" "}
                {timeAgo(selectedSession.startedTime)}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSession(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={Boolean(logoutSession)}
        onClose={() => setLogoutSession(null)}
      >
        <DialogTitle>Are you sure you want to log out?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setLogoutSession(null)}>Cancel</Button>
          <Button onClick={confirmLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActiveSessions;
