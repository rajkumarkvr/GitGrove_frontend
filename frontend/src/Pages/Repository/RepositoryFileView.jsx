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
  const [fileContent, setFileContent] = useState("");
  const [changed, setChanged] = useState(false);
  const [repos, setRepos] = useState({});
  const { reponame, username, filename } = useParams();
  const [loading, setLoading] = useState(true);

  const getBranchname = () => {
    if (sessionStorage.getItem("branch")) {
      sessionStorage.setItem("fetchBranch", sessionStorage.getItem("branch"));
      return sessionStorage.getItem("branch");
    }
    sessionStorage.setItem("fetchBranch", "master");
    return "master";
  };
  const usrinfo = getCurrentUser();

  function change() {
    setChanged((prev) => !prev);
  }

  useEffect(() => {
    if (selectedFile && selectedFile.type === "file") {
      console.log("Fetching content for:", selectedFile.filepath);
      const getFileContent = async () => {
        try {
          console.log(username, reponame, getBranchname());
          const response = await axiosInstance.get(
            `/service/repo-info/file-content?username=${username}&reponame=${reponame}&branchname=${getBranchname()}&filename=${
              selectedFile?.filepath
            }`
          );
          console.log("API response:", response.data);
          let newFileObj = { ...selectedFile, content: response.data };
          console.log("Updated file object:", newFileObj);
          setSelectedFile(newFileObj);
        } catch (err) {
          console.log("API error:", err);
        }
      };
      getFileContent();
    } else {
      console.log("No file selected or not a file type");
    }
  }, [changed]);
  useEffect(() => {
    const fetchRepoInfo = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/service/repo-info/files?username=${username}&reponame=${reponame}&branchname=${getBranchname()}`
        );
        setRepos(response.data);
        const fileToOpen = findFileOrFirstChild(response.data.files, filename);
        const resp = await axiosInstance.get(
          `/service/repo-info/file-content?username=${username}&reponame=${reponame}&branchname=${getBranchname()}&filename=${
            fileToOpen?.filepath
          }`
        );
        let newFileObj = { ...fileToOpen, content: resp.data };
        console.log("Updated file object:", newFileObj);
        setSelectedFile(newFileObj);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoInfo();
  }, []);

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
      {/* {loading ? (
        <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
      ) : (
        <BranchSelector
          branches={repos.branches}
          selectedBranch={repos.defaultBranch}
          setRepos={setRepos}
          username={username}
          reponame={reponame}
        />
      )} */}

      <AppBar color="default" position="fixed" sx={{ paddingLeft: "240px" }}>
        <Toolbar>
          {loading ? (
            <Skeleton variant="text" width={200} height={30} />
          ) : (
            <>
              <BackLink to={`/repo/${username}/${reponame}`} />
              <Typography variant="h6">
                {username} / {reponame} / {getBranchname()}
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
              selectedFile={selectedFile}
              getBranchname={getBranchname}
              onChanged={change}
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
