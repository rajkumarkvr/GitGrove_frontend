import React, { useEffect, useState } from "react";
import CreatePullRequest from "./CreatePullRequest";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import getCurrentUser from "../../Contexts/getCurrentUser";

export const PullRequestWrapper = () => {
  const { username, reponame } = useParams();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const currentUser = getCurrentUser();
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.post(`/service/branches`, {
          ownername: username,
          reponame: reponame,
        });

        console.log(response.data.data);
        setBranches(response.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchBranches();
  }, []);

  const handleCreatePullRequest = async (pullRequestData) => {
    console.log("Creating pull request:", pullRequestData);

    try {
      setLoading(true);
      const response = await axiosInstance.post(`/service/pull-request`, {
        ownerName: username,
        reponame: reponame,
        requesterName: currentUser?.username,
        ...pullRequestData,
      });
      setCreated(true);
      console.log(response.data.message);
    } catch (err) {
      setCreated(false);
      console.log(err);
      return;
    } finally {
      setLoading(false);
    }
  };

  // console.log();

  const getBranchname = () => {
    return branches && branches.length > 0 ? branches[0] : "No branches";
  };
  return (
    <CreatePullRequest
      defaultSourceBranch={getBranchname()}
      defaultTargetBranch={getBranchname()}
      sourceBranches={branches}
      targetBranches={branches}
      onCreatePullRequest={handleCreatePullRequest}
      username={username}
      reponame={reponame}
      loading={loading}
      created={created}
      setCreated={setCreated}
    />
  );
};
