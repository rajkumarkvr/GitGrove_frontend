import React, { useEffect, useState } from "react";
import { Box, Button, Skeleton, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import RepositoryHeader from "./RepositoryHeader";
import BranchSelector from "./BranchSelector";
import FileList from "./FileList";
import getCurrentUser from "../../Contexts/getCurrentUser";
import axiosInstance from "../../axiosInstance";
import FileListSkeleton from "./FileListSkeleton";

const RepositoryDetails = ({ onBranchChange }) => {
  const navigate = useNavigate(); // For navigation
  const { id } = useParams();
  const [repo, setRepos] = useState({});
  const currentUserobj = getCurrentUser();
  const [loading, setLoading] = useState(true); // Default to true for loading state

  useEffect(() => {
    const fetchRepoInfo = async () => {
      setLoading(true); // Start loading spinner before fetching data
      try {
        const response = await axiosInstance.get(
          `/repo-info?username=${currentUserobj.username}&reponame=${id}`
        );
        setRepos(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Stop loading after fetch completes
      }
    };

    fetchRepoInfo();
  }, []);

  return (
    <Box>
      {/* 🔹 Repository Header Skeleton */}
      {loading ? (
        <Skeleton variant="text" width="40%" height={40} />
      ) : (
        <RepositoryHeader
          username={currentUserobj.username}
          repoName={id}
          sshUrl={repo.sshUrl}
        />
      )}

      {/* 🔹 Branch Selector + View Commits Button Skeleton */}
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
              onBranchChange={onBranchChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/repo/1/commits")}
            >
              View Commits
            </Button>
          </>
        )}
      </Box>

      {/* 🔹 File List with Skeleton Effect */}
      {loading ? (
        <FileListSkeleton />
      ) : (
        <FileList files={repo.mainFiles} reponame={id} />
      )}
    </Box>
  );
};

export default RepositoryDetails;
