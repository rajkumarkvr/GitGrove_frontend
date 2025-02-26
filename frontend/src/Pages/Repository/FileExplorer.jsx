import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  TextField,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import BranchSelector from "./BranchSelector";
import axiosInstance from "../../axiosInstance";

const FileExplorer = ({
  files,
  onFileSelect,
  slectedFilename = "",
  selectedFile,
  onChanged,
}) => {
  const [openFolders, setOpenFolders] = useState({});
  const [search, setSearch] = useState("");
  const [selectedFileName, setSelectedFileName] = useState(slectedFilename);
  const [selectedFileNew, setSelectedFileNew] = useState({});
  const theme = useTheme();

  const getBranchname = () => {
    if (sessionStorage.getItem("branch")) {
      sessionStorage.setItem("fetchBranch", sessionStorage.getItem("branch"));
      return sessionStorage.getItem("branch");
    }
    sessionStorage.setItem("fetchBranch", "master");
    return "master";
  };
  console.log("filesssssss", files);
  const handleFileSelect = (file) => {
    console.log("calling");

    // setSelectedFileName(file);
    setSelectedFileName(file.name);
    console.log("printing" + JSON.stringify(file));

    onFileSelect(file);
    onChanged();

    // setSelectedFileNew((prev) => !prev);
  };
  const toggleFolder = useCallback((name) => {
    setOpenFolders((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const searchedFiles = useMemo(() => {
    if (!search) return files;

    const lowerCaseSearch = search.toLowerCase();

    const filterAndExpand = (items) => {
      return items
        .map((file) => {
          if (file.type === "folder") {
            const children = filterAndExpand(file.children || []);
            if (
              file.name.toLowerCase().includes(lowerCaseSearch) ||
              children.length
            ) {
              return { ...file, children };
            }
            return null;
          }
          return file.name.toLowerCase().includes(lowerCaseSearch)
            ? file
            : null;
        })
        .filter(Boolean);
    };

    return filterAndExpand(files);
  }, [files, search]);
  console.log(files);
  return (
    <Box
      sx={{
        width: 300,
        borderRight: "1px solid #ddd",
        p: 2,
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* <BranchSelector /> */}
      {/* 🔍 Global Search Bar */}
      <TextField
        label="Search files & folders"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/*  Render Files & Folders */}
      {searchedFiles && searchedFiles.length === 0 ? (
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "gray", mt: 2 }}
        >
          🚀 No results found
        </Typography>
      ) : (
        <List component="nav">
          {searchedFiles &&
            searchedFiles.map((file) => (
              <React.Fragment key={file.name}>
                {file.type === "folder" ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItem button onClick={() => toggleFolder(file.name)}>
                        <FolderIcon sx={{ mr: 1, color: "#ffa726" }} />
                        <ListItemText primary={file.name} />
                        {openFolders[file.name] ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </ListItem>
                    </motion.div>

                    <Collapse
                      in={openFolders[file.name]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ pl: 3 }}>
                        <FileExplorer
                          files={file.children}
                          onFileSelect={onFileSelect}
                          onChanged={onChanged}
                        />
                      </Box>
                    </Collapse>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListItem
                      button
                      onClick={() => {
                        onFileSelect(file);
                        handleFileSelect(file);
                      }}
                      sx={{
                        backgroundColor:
                          selectedFileNew === file.name
                            ? theme.palette.mode === "dark"
                              ? theme.palette.grey[800]
                              : theme.palette.grey[300]
                            : "transparent",
                        borderRadius: "6px",
                        transition: "background-color 0.2s ease-in-out",
                      }}
                    >
                      <InsertDriveFileIcon sx={{ mr: 1, color: "#66bb6a" }} />
                      <ListItemText
                        primary={file.name}
                        sx={{ cursor: "pointer" }}
                      />
                    </ListItem>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
        </List>
      )}
    </Box>
  );
};

export default FileExplorer;
