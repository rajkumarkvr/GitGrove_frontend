import React, { useEffect, useState } from "react";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import RepositoryHeader from "./RepositoryHeader";
import BranchSelector from "./BranchSelector";
import FileList from "./FileList";
import getCurrentUser from "../../Contexts/getCurrentUser";
import axiosInstance from "../../axiosInstance";
import FileListSkeleton from "./FileListSkeleton";
import EmptyRepository from "./EmptyRepository";

const RepositoryDetails = ({ onBranchChange }) => {
  const navigate = useNavigate(); // For navigation
  const { username, reponame } = useParams();
  const [repo, setRepos] = useState({});
  const currentUserobj = getCurrentUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepoInfo = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/service/repo-info?username=${username}&reponame=${reponame}&branchname=${"master"}`
        );
        console.log(response);
        setRepos(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoInfo();
  }, []);

  const handleCommit = () => {
    if (repo.commits != null) {
      sessionStorage.removeItem("commits");
      const commitDetails = {
        reponame: reponame,
        commits: JSON.stringify(repo.commits),
      };
      sessionStorage.setItem("commits", JSON.stringify(commitDetails));
    }
    navigate(`/repo/commits/${username}/${reponame}`);
  };
  return (
    <Box>
      {loading ? (
        <Skeleton variant="text" width="40%" height={40} />
      ) : (
        <RepositoryHeader
          username={username}
          repoName={reponame}
          sshUrl={repo.sshUrl}
        />
      )}
      {username == currentUserobj?.username &&
      repo.mainFiles &&
      repo.mainFiles.length <= 0 ? (
        <EmptyRepository sshUrl={repo.sshUrl} repoName={reponame} />
      ) : repo.mainFiles && repo.mainFiles.length <= 0 ? (
        <Typography variant="h5" color="info" sx={{ mt: 5 }}>
          No files were found.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          {loading ? (
            <>
              <Skeleton variant="rounded" width={200} height={40} />
              <Skeleton variant="rounded" width={120} height={40} />
            </>
          ) : (
            <>
              <BranchSelector
                branches={repo.branches}
                selectedBranch={repo.defaultBranch}
                sshUrl={repo.sshUrl}
                setRepos={setRepos}
                reponame={reponame}
                username={currentUserobj.username}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCommit()}
              >
                View Commits
              </Button>
            </>
          )}
        </Box>
      )}
      {loading ? (
        <FileListSkeleton />
      ) : (
        <FileList
          files={repo.mainFiles}
          reponame={reponame}
          username={username}
        />
      )}
    </Box>
  );
};

export default RepositoryDetails;
