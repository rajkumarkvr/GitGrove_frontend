import React, { useEffect, useState } from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";
import FileExplorer from "./FileExplorer";
import FileEditor from "./FileEditor";
import BranchSelector from "./BranchSelector";
import axiosInstance from "../../axiosInstance";
import getCurrentUser from "../../Contexts/getCurrentUser";
import { useParams } from "react-router-dom";

const RepositoryFileView = ({ username, selectedBranch, onBranchChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [repos, setRepos] = useState({});
  const { repo } = useParams();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchRepoInfo = async () => {
      setLoading(true); // Start loading spinner before fetching data
      console.log("Fetching");
      console.log(repo);
      const usrinfo = getCurrentUser();
      try {
        const response = await axiosInstance.get(
          `/repo-info?username=${usrinfo.username}&reponame=${repo}`
        );
        setRepos(response.data);
        setLoading(false); // Stop loading spinner after fetching data
        console.log(response.data);
      } catch (error) {
        setLoading(false); // Stop loading spinner after fetching data
        console.log(error);
      }
    };

    fetchRepoInfo();
    fetchRepoInfo();
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BranchSelector
        branches={repos.branches}
        onBranchChange={onBranchChange}
        selectedBranch={selectedBranch}
      />
      {/*  Header with Repository Name */}
      <AppBar color="default" position="fixed" sx={{ paddingLeft: "240px" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#333" }}>
            {username} / {repo}
          </Typography>
        </Toolbar>
      </AppBar>

      {/*  Main Content (FileExplorer + FileEditor) */}
      <Box sx={{ display: "flex", flexGrow: 1, height: "calc(100vh - 64px)" }}>
        {/*  File Explorer */}
        <Box
          sx={{
            width: "30%",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
          }}
        >
          <FileExplorer files={repos.files} onFileSelect={setSelectedFile} />
        </Box>

        {/*  File Editor */}
        <Box sx={{ flexGrow: 1, p: 2, overflow: "auto" }}>
          <FileEditor file={selectedFile} />
        </Box>
      </Box>
    </Box>
  );
};

export default RepositoryFileView;
