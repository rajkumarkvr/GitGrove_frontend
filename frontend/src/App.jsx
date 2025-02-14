// import { Button, Box, Typography } from "@mui/material";
import { ThemeContext } from "./ThemeContext";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/DashBoard/DashBoard";
import SettingsLayout from "./Pages/Settings/SettingsLayout/SettingsLayout";
import ThemeSettings from "./Pages/Settings/Theme/ThemeSettings";
import ProfileSettings from "./Pages/Settings/ProfileSettings/ProfileSettings";
import AccountSettings from "./Pages/Settings/AccountSettings/AccountSettings";
import CreateRepo from "./Pages/CreateRepo/CreateRepo";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import MainPasswordReset from "./Pages/ResetPassword/MainPasswordReset";
import MyRepository from "./Pages/Repository/MyRepository";
import RepositoryDetails from "./Pages/Repository/RepositoryDetails";
import RepositoryFileView from "./Pages/Repository/RepositoryFileView";
import CommitList from "./Pages/Repository/CommitList";
import axiosInstance from "./axiosInstance";
import getCurrentUser from "./Contexts/getCurrentUser";
import Starred from "./Pages/Starred/Starred";
// import HomeIcon from "@mui/icons-material/Home";
//1 unit = 8px by default in MUI
// const repo = {
//   name: "SampleRepo",
//   sshUrl: "git@github.com:user/SampleRepo.git",
//   branches: ["main", "develop", "feature-branch"],
//   defaultBranch: "main",
//   commits: [
//     { id: "c1", message: "Initial commit", date: "2025-02-10T12:00:00Z" },
//     { id: "c2", message: "Added login feature", date: "2025-02-11T15:30:00Z" },
//     { id: "c3", message: "Fixed navbar issue", date: "2025-02-12T09:45:00Z" },
//   ],
//   mainFiles: [
//     {
//       name: "src",
//       type: "folder",
//       commitMessage: "Updated components",
//       commitTime: "2024-02-12 10:30 AM",
//     },
//     {
//       name: "index.js",
//       type: "file",
//       commitMessage: "Fixed bug in routing",
//       commitTime: "2024-02-12 11:00 AM",
//     },
//     {
//       name: "package.json",
//       type: "file",
//       commitMessage: "Updated dependencies",
//       commitTime: "2024-02-11 05:45 PM",
//     },
//     {
//       name: "README.md",
//       type: "file",
//       commitMessage: "Added project description",
//       commitTime: "2024-02-10 02:15 PM",
//     },
//     {
//       name: "public",
//       type: "folder",
//       commitMessage: "Updated assets",
//       commitTime: "2024-02-09 09:00 AM",
//     },
//   ],

//   files: [
//     {
//       name: "src",
//       type: "folder",
//       children: [
//         {
//           name: "components",
//           type: "folder",
//           children: [
//             {
//               name: "Header.js",
//               type: "file",
//               content: "export const Header = () => <header>Header</header>;",
//             },
//             {
//               name: "Footer.js",
//               type: "file",
//               content: "export const Footer = () => <footer>Footer</footer>;",
//             },
//           ],
//         },
//         {
//           name: "App.js",
//           type: "file",
//           content:
//             "import React from 'react'; function App() { return <div>Hello World</div>; } export default App;",
//         },
//         {
//           name: "index.js",
//           type: "file",
//           content:
//             "import ReactDOM from 'react-dom'; import App from './App'; ReactDOM.render(<App />, document.getElementById('root'));",
//         },
//       ],
//     },
//     {
//       name: "public",
//       type: "folder",
//       children: [
//         {
//           name: "index.html",
//           type: "file",
//           content:
//             "<!DOCTYPE html><html><head><title>Sample</title></head><body><div id='root'></div></body></html>",
//         },
//       ],
//     },
//     {
//       name: "README.md",
//       type: "file",
//       content: "# SampleRepo\nThis is a sample repository for testing.",
//     },
//     {
//       name: ".gitignore",
//       type: "file",
//       content: "node_modules/\nbuild/\n.env",
//     },
//   ],
// };

function App() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [repo, setRepos] = useState({});
  const userinfo = getCurrentUser();
  const onBranchChange = (name) => {
    console.log(name);
  };

  const [selectedFile, setSelectedFile] = useState(null);

  // useEffect(() => {
  //   const fetchRepoInfo = async () => {
  //     setLoading(true); // Start loading spinner before fetching data
  //     console.log("Fetching");
  //
  //     try {
  //       const response = await axiosInstance.get(
  //         `/repo-info?username=${usrinfo.username}&reponame=${id}`
  //       );
  //       setRepos(response.data);
  //       setLoading(false); // Stop loading spinner after fetching data
  //       console.log(response.data);
  //     } catch (error) {
  //       setLoading(false); // Stop loading spinner after fetching data
  //       console.log(error);
  //     }
  //   };

  //   fetchRepoInfo();
  // }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/repositories" replace />} />
        <Route path="/" element={<Dashboard toggleTheme={toggleTheme} />}>
          <Route index path="repositories" element={<MyRepository />} />
          <Route
            path="/repo/:id"
            element={<RepositoryDetails onBranchChange={onBranchChange} />}
          />
          <Route
            path="/repo/:id/commits"
            element={<CommitList commits={repo.commits} />}
          />
          {/* <Route
            path="/repo/files"
            element={
              <RepositoryFileView
                files={repo.files}
                repositoryName={repo.name}
                username={""}
                branches={repo.branches}
                selectedBranch={repo.defaultBranch}
                onBranchChange={onBranchChange}
              />
            }
          /> 
          ;*/}
          <Route
            path="/repo/files/:repo/:id"
            element={
              <RepositoryFileView
                username={userinfo.username}
                selectedBranch={repo.defaultBranch}
                onBranchChange={onBranchChange}
              />
            }
          />
          ;
          <Route path="explore" element={<h1>Explore</h1>} />
          <Route path="create-repo" element={<CreateRepo />} />
          <Route path="starred" element={<Starred />} />
          <Route path="pull-requests" element={<h1>Pull Requets</h1>} />
          <Route path="profile" element={<h1>Profile</h1>} />
          {/* Nested Settings Route */}
          <Route
            path="/settings"
            element={<Navigate to="/settings/profile-edit" replace />}
          />
          <Route path="settings" element={<SettingsLayout />}>
            <Route
              path="theme"
              element={
                <ThemeSettings toggleTheme={toggleTheme} mode={darkMode} />
              }
            />
            <Route path="profile-edit" element={<ProfileSettings />} />
            <Route path="account" element={<AccountSettings />} />
          </Route>
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route
          path="/auth/main-reset-password/:token"
          element={<MainPasswordReset />}
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

// <Box sx={{ textAlign: "center", mt: 5 }}>
// <HomeIcon sx={{ fontSize: { xs: 20, sm: 30, md: 40, lg: 50 } }} />
// <Typography variant="h1">Hello, World!</Typography>
// <Typography variant="h6">
//   Current Theme: {darkMode ? "Dark" : "Light"}
// </Typography>
// <Button
//   variant="contained"
//   color="primary"
//   onClick={toggleTheme}
//   sx={{ mt: 2 }}
// >
//   Toggle Theme
// </Button>
// </Box>
