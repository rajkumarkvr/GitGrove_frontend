import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Skeleton,
  List,
  ListItem,
} from "@mui/material";
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
  const [loading, setLoading] = useState(true); // Start loading as true

  useEffect(() => {
    const fetchRepoInfo = async () => {
      setLoading(true); // Start loading spinner before fetching data
      const usrinfo = getCurrentUser();
      try {
        const response = await axiosInstance.get(
          `service/repo-info?username=${usrinfo.username}&reponame=${repo}`
        );
        setRepos(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Stop loading spinner after fetching data
      }
    };

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
      {/* Branch Selector */}
      {loading ? (
        <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
      ) : (
        <BranchSelector
          branches={repos.branches}
          onBranchChange={onBranchChange}
          selectedBranch={selectedBranch}
        />
      )}

      {/* Header with Repository Name */}
      <AppBar color="default" position="fixed" sx={{ paddingLeft: "240px" }}>
        <Toolbar>
          {loading ? (
            <Skeleton variant="text" width={200} height={30} />
          ) : (
            <Typography variant="h6" sx={{ flexGrow: 1, color: "#333" }}>
              {username} / {repo}
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content (File Explorer + File Editor) */}
      <Box sx={{ display: "flex", flexGrow: 1, height: "calc(100vh - 64px)" }}>
        {/* File Explorer (Left Side) */}
        <Box
          sx={{
            width: "30%",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
            p: 2,
          }}
        >
          {loading ? (
            // Skeleton Loader for File Explorer
            <List>
              {Array.from({ length: 6 }).map((_, index) => (
                <ListItem key={index}>
                  <Skeleton
                    variant="circular"
                    width={24}
                    height={24}
                    sx={{ mr: 1 }}
                  />
                  <Skeleton variant="text" width="80%" />
                </ListItem>
              ))}
            </List>
          ) : (
            <FileExplorer files={repos.files} onFileSelect={setSelectedFile} />
          )}
        </Box>

        {/* File Editor (Right Side) */}
        <Box sx={{ flexGrow: 1, p: 2, overflow: "auto" }}>
          {loading ? (
            // Skeleton Loader for File Editor
            <Box>
              <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height="80vh" />
            </Box>
          ) : (
            <FileEditor file={selectedFile} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RepositoryFileView;
