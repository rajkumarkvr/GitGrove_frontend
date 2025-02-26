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
import {
  People,
  Group,
  GroupAddSharp,
  CompareArrows,
  ViewAgendaSharp,
  Visibility,
} from "@mui/icons-material";
import AddPeopleDialog from "./AddPeopleDialog";
import axiosInstance from "../../axiosInstance";
import mailServerAxiosInstance from "../../mailServerAxiosInstance";
import getCurrentUser from "../../Contexts/getCurrentUser";
import ViewCollaboratorsDialog from "./Collaborations/ViewCollaborators";
import Lottie from "lottie-react";
import handleCopy from "../../CustomHooks/handleCopy";
import BackLink from "../../Components/BackLink";
import { BiPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import ViewPullRequestsDialog from "../PullRequest/ViewPullRequestsDialog";

const RepositoryHeader = ({ repoName, sshUrl, username }) => {
  const [copied, setCopied] = useState(false);
  const [openAddPeople, setOpenAddPeople] = useState(false);
  const [open, setOpen] = useState(false);
  const [viewPullRequests, setViewPullRequests] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const currentUser = getCurrentUser();
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const [collab, setCollab] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("/assets/download-anime.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, []);

  const handleClose = () => {
    setViewPullRequests(false); //
  };
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
  console.log(currentUser.username == username);
  useEffect(() => {
    const isACollaborator = async () => {
      try {
        const response = await axiosInstance.post(
          `/service/user/collaborator?ownername=${username}&reponame=${repoName}&username=${currentUser?.username}`
        );
        console.log(response.data);
        // console.log(response.data.isCollaborator != "false");
        setCollab(response.data.isCollaborator);
      } catch (error) {
        console.error("Error checking if user is a collaborator:", error);
      }
    };
    isACollaborator();
  }, []);

  // let collab = false;
  // isACollaborator().then((response) => {
  //   collab = response;
  // });
  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        sx={{ boxShadow: 2, padding: 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
          <BackLink to="/repositories" />
          <Typography variant="h6">
            {username} / {repoName}
          </Typography>

          <Box sx={{ display: "flex", columnGap: 3 }}>
            {(currentUser.username == username || collab) && (
              <>
                <Tooltip title="View pull requests">
                  <Button
                    color="error"
                    variant="contained"
                    startIcon={<Visibility />}
                    sx={{ ml: 2 }}
                    onClick={() => {
                      setViewPullRequests(true);
                    }}
                  >
                    View pull requests
                  </Button>
                </Tooltip>
                <Tooltip title="Make a pull request">
                  <Button
                    color="warning"
                    variant="contained"
                    startIcon={<BiPlus />}
                    sx={{ ml: 2 }}
                    onClick={() => {
                      navigate(
                        `/repo/createpullrequest/${username}/${repoName}`
                      );
                    }}
                  >
                    New Pull Request
                  </Button>
                </Tooltip>
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
              </>
            )}
            {currentUser.username == username && (
              <>
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
      <ViewPullRequestsDialog
        open={viewPullRequests}
        handleClose={handleClose}
        repoName={repoName}
        username={username}
      />
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
        username={username}
      />
    </>
  );
};

export default RepositoryHeader;
