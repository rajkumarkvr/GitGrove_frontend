import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";

const CommitList = ({ commits }) => {
  return (
    <List>
      <Typography variant="h6" fontWeight="bold">
        Recent Commits
      </Typography>
      {commits.map((commit, index) => (
        <React.Fragment key={commit.id}>
          <ListItem>
            <ListItemText
              primary={commit.message}
              secondary={`Committed on: ${new Date(
                commit.date
              ).toLocaleString()}`}
            />
          </ListItem>
          {index !== commits.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default CommitList;
