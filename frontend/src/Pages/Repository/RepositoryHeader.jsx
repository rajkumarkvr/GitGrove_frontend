import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Snackbar,
  Box,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { People, Group, GroupAddSharp } from "@mui/icons-material";
import AddPeopleDialog from "./AddPeopleDialog";
import axiosInstance from "../../axiosInstance";
import mailServerAxiosInstance from "../../mailServerAxiosInstance";
import getCurrentUser from "../../Contexts/getCurrentUser";
import ViewCollaboratorsDialog from "./Collaborations/ViewCollaborators";
import Lottie from "lottie-react";
import handleCopy from "../../CustomHooks/handleCopy";
import BackLink from "../../Components/BackLink";

const RepositoryHeader = ({ repoName, sshUrl, username }) => {
  const [copied, setCopied] = useState(false);
  const [openAddPeople, setOpenAddPeople] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const currentUser = getCurrentUser();
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/assets/download-anime.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, []);

  const handleAddToRepository = (selectedUsers) => {
    console.log("Users added to repository:", selectedUsers);
    if (selectedUsers.length > 0) {
      console.log("Conditional");
      const sendEmails = async () => {
        setLoading(true);
        const inviterDetails = {
          username: currentUser?.username,
          avator: currentUser?.profile_url,
          email: currentUser?.email,
          repositoryName: repoName,
        };
        try {
          const response = await mailServerAxiosInstance.post(
            "/api/users/invite-collab",
            { users: selectedUsers, inviter: inviterDetails }
          );

          const requestCollaborationAdd = async (requestDetails) => {
            try {
              const response = await axiosInstance.post(
                `/service/requestcollaborator?ownername=${encodeURIComponent(
                  requestDetails.ownername
                )}&inviteename=${encodeURIComponent(
                  requestDetails.inviteename
                )}&reponame=${encodeURIComponent(requestDetails.reponame)}`
              );
              console.log(response.data);
            } catch (err) {
              console.log(err);
              return;
            } finally {
              setLoading(false);
            }
            console.log(response.data);
          };
          selectedUsers.forEach((user) => {
            const requestDetails = {
              ownername: currentUser?.username,
              inviteename: user.username,
              reponame: repoName,
            };
            requestCollaborationAdd(requestDetails);
          });

          setSuccess(true);
          // setOpenAddPeople(false);
          console.log(response.data);
          setLoading(false);
        } catch (err) {
          setOpenAddPeople(false);
          setLoading(false);
          console.log(err);
        }
      };
      sendEmails();
      //send confirmation mail to selected users
    }
  };

  const handleDownload = async () => {
    try {
      setAnimationPlaying(true);
      const currentBranch = sessionStorage.getItem("branch") || "master";

      const response = await axiosInstance.get(
        `/service/download/zip?reponame=${repoName}&username=${username}&branchname=${currentBranch}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/zip" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute(
        "download",
        `${username}-${repoName}-${currentBranch}.zip`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading ZIP:", error);
    } finally {
      setTimeout(() => {
        setAnimationPlaying(false);
      }, 1500);
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        sx={{ boxShadow: 2, padding: 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <BackLink to="/repositories" />
          <Typography variant="h6">
            {username} / {repoName}
          </Typography>

          <Box sx={{ display: "flex", columnGap: 3 }}>
            {currentUser.username == username && (
              <>
                <Tooltip title="View Collaborators">
                  <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<Group />}
                    sx={{ ml: 2 }}
                    onClick={() => setOpen(true)}
                  >
                    View Collaborators
                  </Button>
                </Tooltip>
                <Tooltip title="Add people">
                  <Button
                    color="success"
                    variant="contained"
                    startIcon={<GroupAddSharp />}
                    sx={{ ml: 2 }}
                    onClick={() => setOpenAddPeople(true)}
                  >
                    Add people
                  </Button>
                </Tooltip>
              </>
            )}

            <Tooltip title="Download as Zip">
              <Button
                variant="contained"
                startIcon={
                  animationPlaying ? (
                    <Lottie
                      animationData={animationData}
                      loop
                      style={{ width: 30, height: 30 }}
                    />
                  ) : (
                    <CloudDownloadIcon />
                  )
                }
                sx={{
                  ml: 2,
                  backgroundColor: animationPlaying ? "#1976d2" : "default",
                  transition: "all 0.3s ease",
                }}
                onClick={handleDownload}
                disabled={animationPlaying}
              >
                {animationPlaying ? "Downloading..." : "Download ZIP"}
              </Button>
            </Tooltip>

            <Tooltip title="Copy SSH URL">
              <IconButton
                onClick={() => {
                  handleCopy(sshUrl, setCopied);
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="SSH URL copied!"
      />

      {/* Add People Dialog */}
      <AddPeopleDialog
        open={openAddPeople}
        handleClose={() => setOpenAddPeople(false)}
        repoName={repoName}
        handleAddToRepository={handleAddToRepository}
        loading={loading}
        success={success}
        setSuccess={setSuccess}
      />
      <ViewCollaboratorsDialog
        open={open}
        handleClose={() => setOpen(false)}
        repoName={repoName}
      />
    </>
  );
};

export default RepositoryHeader;
