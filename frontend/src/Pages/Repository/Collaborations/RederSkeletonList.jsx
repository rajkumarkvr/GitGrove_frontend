import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from "@mui/material";

// Function to render skeleton loaders
const RenderSkeletonList = (numItems = 4) => {
  return (
    <List>
      {Array.from({ length: numItems }).map((_, index) => (
        <ListItem key={index} sx={{ borderBottom: "1px solid #ddd" }}>
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton width="40%" />}
            secondary={<Skeleton width="60%" />}
          />
          <Skeleton variant="rectangular" width={60} height={24} />
        </ListItem>
      ))}
    </List>
  );
};

export default RenderSkeletonList;
