import React, { useState } from "react";
import { Box } from "@mui/material";
import RepositoryHeader from "./RepositoryHeader";
import BranchList from "./BranchList";
import CommitList from "./CommitList";
import FileExplorer from "./FileExplorer";
import FileEditor from "./FileEditor";

const repo = {
  name: "SampleRepo",
  sshUrl: "git@github.com:user/SampleRepo.git",
  branches: ["main", "develop", "feature-branch"],
  defaultBranch: "main",
  commits: [
    { id: "c1", message: "Initial commit", date: "2025-02-10T12:00:00Z" },
    { id: "c2", message: "Added login feature", date: "2025-02-11T15:30:00Z" },
    { id: "c3", message: "Fixed navbar issue", date: "2025-02-12T09:45:00Z" },
  ],
  files: [
    {
      name: "src",
      type: "folder",
      children: [
        {
          name: "components",
          type: "folder",
          children: [
            {
              name: "Header.js",
              type: "file",
              content: "export const Header = () => <header>Header</header>;",
            },
            {
              name: "Footer.js",
              type: "file",
              content: "export const Footer = () => <footer>Footer</footer>;",
            },
          ],
        },
        {
          name: "App.js",
          type: "file",
          content:
            "import React from 'react'; function App() { return <div>Hello World</div>; } export default App;",
        },
        {
          name: "index.js",
          type: "file",
          content:
            "import ReactDOM from 'react-dom'; import App from './App'; ReactDOM.render(<App />, document.getElementById('root'));",
        },
      ],
    },
    {
      name: "public",
      type: "folder",
      children: [
        {
          name: "index.html",
          type: "file",
          content:
            "<!DOCTYPE html><html><head><title>Sample</title></head><body><div id='root'></div></body></html>",
        },
      ],
    },
    {
      name: "README.md",
      type: "file",
      content: "# SampleRepo\nThis is a sample repository for testing.",
    },
    {
      name: ".gitignore",
      type: "file",
      content: "node_modules/\nbuild/\n.env",
    },
  ],
};

const RepositoryDetails = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <Box>
      <RepositoryHeader repoName={repo.name} sshUrl={repo.sshUrl} />
      <BranchList
        branches={repo.branches}
        selectedBranch={repo.defaultBranch}
      />
      <CommitList commits={repo.commits} />
      <Box sx={{ display: "flex" }}>
        <FileExplorer files={repo.files} onFileSelect={setSelectedFile} />
        <FileEditor file={selectedFile} />
      </Box>
    </Box>
  );
};

export default RepositoryDetails;
