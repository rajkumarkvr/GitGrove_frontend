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
import BackLink from "../../Components/BackLink";

const RepositoryFileView = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [repos, setRepos] = useState({});
  const { reponame, username, filename } = useParams();
  const [loading, setLoading] = useState(true);
  const usrinfo = getCurrentUser();

  useEffect(() => {
    const fetchRepoInfo = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `service/repo-info?username=${username}&reponame=${reponame}&branchname=master`
        );
        setRepos(response.data);

        // Determine the correct file to open
        const fileToOpen = findFileOrFirstChild(response.data.files, filename);
        setSelectedFile(fileToOpen);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoInfo();
  }, [username, reponame, filename]);

  const findFileOrFirstChild = (files, name) => {
    const fileObj = files.find((file) => file.name === name);
    if (!fileObj) return null;

    if (fileObj.type === "file") return fileObj;

    if (fileObj.children && fileObj.children.length > 0) {
      return findFileOrFirstChild(fileObj.children, fileObj.children[0].name);
    }

    return null;
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
      ) : (
        <BranchSelector
          branches={repos.branches}
          selectedBranch={repos.defaultBranch}
          setRepos={setRepos}
          username={username}
          reponame={reponame}
        />
      )}

      <AppBar color="default" position="fixed" sx={{ paddingLeft: "240px" }}>
        <Toolbar>
          {loading ? (
            <Skeleton variant="text" width={200} height={30} />
          ) : (
            <>
              <BackLink to={`/repo/${username}/${reponame}`} />
              <Typography variant="h6">
                {username} / {reponame}
              </Typography>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          height: "calc(100vh - 64px)",
        }}
      >
        <Box
          sx={{
            width: "30%",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
            p: 2,
          }}
        >
          {loading ? (
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
            <FileExplorer
              files={repos.files}
              onFileSelect={setSelectedFile}
              slectedFilename={selectedFile?.name}
            />
          )}
        </Box>

        <Box sx={{ flexGrow: 1, p: 2, overflow: "auto" }}>
          {loading ? (
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
