import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

const FileListSkeleton = () => {
  return (
    <List>
      {[...Array(5)].map((_, index) => (
        <ListItem key={index} divider>
          {/* Icon and Name */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ flexGrow: 1 }}
          >
            <ListItemIcon>
              {index % 2 === 0 ? (
                <FolderIcon color="disabled" />
              ) : (
                <InsertDriveFileOutlinedIcon />
              )}
            </ListItemIcon>
            <Skeleton variant="text" width={150} height={30} />
          </Stack>

          {/* Commit Message and Time */}
          <Stack
            direction="row"
            spacing={4}
            sx={{ justifyContent: "flex-end", flexGrow: 1 }}
          >
            <Skeleton variant="text" width={200} height={20} />
            <Skeleton variant="text" width={100} height={20} />
          </Stack>
        </ListItem>
      ))}
    </List>
  );
};

export default FileListSkeleton;
