import React, { useState } from "react";
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

const RepositoryHeader = ({ repoName, sshUrl, username }) => {
  const [copied, setCopied] = useState(false);
  const [openAddPeople, setOpenAddPeople] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const currentUser = getCurrentUser();
  const handleCopy = () => {
    navigator.clipboard.writeText(sshUrl);
    setCopied(true);
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

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        sx={{ boxShadow: 2, padding: 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">
            {username} / {repoName}
          </Typography>

          <Box sx={{ display: "flex", columnGap: 3 }}>
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

            <Tooltip title="Download as Zip">
              <Button
                variant="contained"
                startIcon={<CloudDownloadIcon />}
                sx={{ ml: 2 }}
              >
                Download ZIP
              </Button>
            </Tooltip>

            <Tooltip title="Copy SSH URL">
              <IconButton onClick={handleCopy}>
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
