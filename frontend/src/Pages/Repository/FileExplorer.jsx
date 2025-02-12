import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  TextField,
  Box,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FileExplorer = ({ files, onFileSelect }) => {
  const [openFolders, setOpenFolders] = useState({});
  const [search, setSearch] = useState("");

  const toggleFolder = (name) => {
    setOpenFolders((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ width: 250, borderRight: "1px solid #ddd", p: 2 }}>
      <TextField
        label="Search files"
        fullWidth
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <List>
        {filteredFiles.map((file) => (
          <React.Fragment key={file.name}>
            {file.type === "folder" ? (
              <>
                <ListItem button onClick={() => toggleFolder(file.name)}>
                  <FolderIcon sx={{ mr: 1 }} />
                  <ListItemText primary={file.name} />
                  {openFolders[file.name] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ListItem>
                <Collapse
                  in={openFolders[file.name]}
                  timeout="auto"
                  unmountOnExit
                >
                  <FileExplorer
                    files={file.children}
                    onFileSelect={onFileSelect}
                  />
                </Collapse>
              </>
            ) : (
              <ListItem button onClick={() => onFileSelect(file)}>
                <InsertDriveFileIcon sx={{ mr: 1 }} />
                <ListItemText primary={file.name} />
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default FileExplorer;
