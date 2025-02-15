import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Stack,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { Link } from "react-router-dom";

const FileList = ({ files, reponame }) => {
  if (files == null || files.length === 0)
    return (
      <Typography variant="h5" color="info">
        No files were found.
      </Typography>
    );
  return (
    <List>
      {files.map((file, index) => (
        <ListItem
          key={index}
          divider
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Icon and Name with Link */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <ListItemIcon>
              {file.type === "folder" ? (
                <FolderIcon color="primary" />
              ) : (
                <InsertDriveFileOutlinedIcon />
              )}
            </ListItemIcon>
            <Typography
              component={Link}
              to={`/repo/files/${reponame}/${file.name}`}
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: "bold",
                "&:hover": { textDecoration: "underline", color: "blue" },
              }}
            >
              {file.name}
            </Typography>
          </Stack>

          {/* Commit Message and Time */}
          <Stack
            direction="row"
            spacing={4}
            sx={{ flexGrow: 1, justifyContent: "flex-end" }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                maxWidth: "40%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {file.commitMessage}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {file.commitTime}
            </Typography>
          </Stack>
        </ListItem>
      ))}
    </List>
  );
};

export default FileList;
