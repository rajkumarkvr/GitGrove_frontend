import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  TextField,
  FormControlLabel,
  Switch,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { ExpandLess, ExpandMore, Search } from "@mui/icons-material";
import DiffViewer from "react-diff-viewer";
import { motion } from "framer-motion";
import axiosInstance from "../../../axiosInstance";

const DifferenceViewer = () => {
  const { username, reponame, commitHash } = useParams();
  const [fileChanges, setFileChanges] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [diffData, setDiffData] = useState({ oldCode: "", newCode: "" });
  const [expandedFolders, setExpandedFolders] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Customization options
  const [theme, setTheme] = useState("light");
  const [viewMode, setViewMode] = useState("split");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  useEffect(() => {
    fetchCommitDifferences();
  }, [commitHash]);

  const fetchCommitDifferences = async () => {
    try {
      const response = await axiosInstance.post("/service/GetCommitVersions", {
        username,
        reponame,
        commitHash,
      });
      const files = response.data.message;
      setFileChanges(files);
      loadFirstFile(files);
    } catch (error) {
      console.error("Error fetching commit differences:", error);
    }
  };

  const loadFirstFile = (files) => {
    if (!files || files.length === 0) return;

    const findFirstFile = (nodes) => {
      for (let file of nodes) {
        if (!file.changeType) return findFirstFile(file.children || []);
        return file;
      }
      return null;
    };

    const firstFile = findFirstFile(files);
    if (firstFile) handleFileClick(firstFile);
  };

  const toggleFolder = (folderPath) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  const handleFileClick = (file) => {
    if (!file.changes) {
      setSelectedFile(file.path);
      setDiffData({ oldCode: "", newCode: file.newContent || "" });
      return;
    }

    setSelectedFile(file.path);
    setDiffData({
      oldCode: file.changes[0]?.oldContent || "",
      newCode: file.changes[0]?.newContent || "",
    });
  };

  const renderFileTree = (files) => {
    if (!files || files.length === 0) {
      return (
        <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
          No search results
        </Typography>
      );
    }

    const tree = {};
    files.forEach((file) => {
      const parts = file.path.split("/");
      let current = tree;
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = index === parts.length - 1 ? file : {};
        }
        current = current[part];
      });
    });

    const renderTree = (nodes, path = "") => {
      return Object.entries(nodes).map(([key, value]) => {
        const fullPath = `${path}/${key}`;
        const isFolder = typeof value === "object" && !value.changeType;
        return (
          <React.Fragment key={fullPath}>
            <ListItem
              button
              onClick={() =>
                isFolder ? toggleFolder(fullPath) : handleFileClick(value)
              }
            >
              {isFolder ? (
                <>
                  <ListItemText primary={key} />
                  {expandedFolders[fullPath] ? <ExpandLess /> : <ExpandMore />}
                </>
              ) : (
                <ListItemText primary={key} />
              )}
            </ListItem>
            {isFolder && (
              <Collapse
                in={expandedFolders[fullPath]}
                timeout="auto"
                unmountOnExit
              >
                <List sx={{ pl: 2 }}>{renderTree(value, fullPath)}</List>
              </Collapse>
            )}
          </React.Fragment>
        );
      });
    };

    return renderTree(tree);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", p: 2, gap: 2 }}>
      {/* Left Side - File Explorer */}
      <Paper sx={{ width: "30%", p: 2, borderRadius: 2, overflowY: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          File Explorer
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search files..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
        <List>
          {renderFileTree(
            fileChanges.filter((file) =>
              file.path.toLowerCase().includes(searchTerm)
            )
          )}
        </List>
      </Paper>

      {/* Right Side - Diff Viewer */}
      <Paper sx={{ flex: 1, p: 2, borderRadius: 2, overflowY: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {selectedFile ? `Changes in -> ${selectedFile}` : "Select a file"}
        </Typography>

        {/* Customization Options */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={theme === "dark"}
                onChange={() => setTheme(theme === "light" ? "dark" : "light")}
              />
            }
            label="Dark Mode"
          />

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
          >
            <ToggleButton value="split">Split View</ToggleButton>
            <ToggleButton value="inline">Inline View</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {selectedFile ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <DiffViewer
              oldValue={diffData.oldCode}
              newValue={diffData.newCode}
              splitView={viewMode === "split"}
              useDarkTheme={theme === "dark"}
            />
          </motion.div>
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
            Select a file to view differences.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DifferenceViewer;
