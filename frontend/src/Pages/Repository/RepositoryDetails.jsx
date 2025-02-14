import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import RepositoryHeader from "./RepositoryHeader";
import BranchSelector from "./BranchSelector";
import CommitList from "./CommitList";
import FileList from "./FileList";
import getCurrentUser from "../../Contexts/getCurrentUser";
import axiosInstance from "../../axiosInstance";
import Loading from "../../Components/Loading";

const RepositoryDetails = ({ onBranchChange }) => {
  const navigate = useNavigate(); // For navigation
  const { id } = useParams();
  const [repo, setRepos] = useState({});
  const currentUserobj = getCurrentUser();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchRepoInfo = async () => {
      setLoading(true); // Start loading spinner before fetching data
      console.log("Fetching");
      const usrinfo = getCurrentUser();
      try {
        const response = await axiosInstance.get(
          `/repo-info?username=${currentUserobj.username}&reponame=${id}`
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
  }, []);
  return (
    <Box>
      {/* 🔹 Repository Header */}
      <RepositoryHeader
        username={currentUserobj.username}
        repoName={id}
        sshUrl={repo.sshUrl}
      />

      {loading && <Loading />}
      {/* 🔹 Branch Selector + View Commits Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <BranchSelector
          branches={repo.branches}
          selectedBranch={repo.defaultBranch}
          onBranchChange={onBranchChange}
        />

        {/* 📝 View Commits Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/repo/1/commits")}
        >
          View Commits
        </Button>
      </Box>

      <FileList files={repo.mainFiles} reponame={id}/>
    </Box>
  );
};

export default RepositoryDetails;
