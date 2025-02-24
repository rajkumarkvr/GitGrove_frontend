import React from "react";
import CreatePullRequest from "./CreatePullRequest";

export const PullRequestWrapper = () => {
  const sourceBranches = [
    "feature/new-login",
    "feature/bug-fix",
    "feature/update-docs",
  ];
  const targetBranches = ["main", "develop", "release/v1.0"];

  const handleCreatePullRequest = (pullRequestData) => {
    console.log("Creating pull request:", pullRequestData);
    // Here, you can make an API call to create the pull request
  };

  return (
    <CreatePullRequest
      defaultSourceBranch="feature/new-login"
      defaultTargetBranch="main"
      sourceBranches={sourceBranches}
      targetBranches={targetBranches}
      onCreatePullRequest={handleCreatePullRequest}
    />
  );
};
