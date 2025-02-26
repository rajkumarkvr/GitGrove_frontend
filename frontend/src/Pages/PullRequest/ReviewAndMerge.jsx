import { useTheme } from "@mui/material/styles";
import {
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  Box,
  Avatar,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  AddComment,
  CheckCircle,
  ErrorOutline,
  MergeType,
} from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../axiosInstance";

const ReviewAndMerge = ({
  oldCode,
  newCode,
  comments,
  onAddComment,
  onResolveComment,
  onMerge,
  title,
  creatorname,
  sourceBranch,
  targetBranch,
  reponame,
  prid,
  merged,
  setMerged,
}) => {
  const theme = useTheme();
  const commentsContainerRef = useRef(null);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [generalCommentText, setGeneralCommentText] = useState("");
  const [autoMergeLoading, setAutoMergeLoading] = useState(true);
  const [autoMergePossible, setAutoMergePossible] = useState(null);

  useEffect(() => {
    checkAutoMerge();
  }, []);

  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop =
        commentsContainerRef.current.scrollHeight;
    }
  }, [comments]);

  const checkAutoMerge = async () => {
    setAutoMergeLoading(true);
    try {
      const response = await axiosInstance.get(
        `/service/pull-request/check-auto-merge?PRId=${prid}`
      );

      // console.log(response);
      setAutoMergePossible(response.data.canAutoMerge);
    } catch (error) {
      console.error("Error checking auto-merge:", error);
      setAutoMergePossible(false);
    } finally {
      setAutoMergeLoading(false);
    }
  };

  const handleMerge = () => {
    setMergeDialogOpen(true);
  };

  const confirmMerge = () => {
    onMerge();
    setMergeDialogOpen(false);
  };

  const handleSubmitComment = () => {
    if (generalCommentText.trim() === "") return;
    onAddComment({ text: generalCommentText });
    setGeneralCommentText("");
    setTimeout(() => {
      if (commentsContainerRef.current) {
        commentsContainerRef.current.scrollTop =
          commentsContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        position: "relative",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          mb: theme.spacing(2),
          p: theme.spacing(2),
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[100],
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[2],
        }}
      >
        <Typography variant="h5" fontWeight={700} color="text.primary">
          {decodeURIComponent(title)}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              bgcolor: theme.palette.primary.main,
            }}
          >
            {creatorname.charAt(0)}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            Created by <strong>{creatorname}</strong>
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mb: 2,
          p: 1.5,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[800]
              : theme.palette.grey[100],
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
        }}
      >
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[700]
                : theme.palette.grey[300],
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          📂 Repo: {reponame}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.success.dark
                : theme.palette.success.light,
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          🌿 {sourceBranch} → {targetBranch}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
          p: 2,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          backgroundColor: autoMergePossible
            ? theme.palette.mode === "dark"
              ? theme.palette.success.dark
              : theme.palette.success.light
            : theme.palette.mode === "dark"
            ? theme.palette.error.dark
            : theme.palette.error.light,
          color:
            theme.palette.mode === "dark"
              ? theme.palette.grey[200]
              : theme.palette.grey[900],
        }}
      >
        {autoMergeLoading ? (
          <>
            <CircularProgress
              size={20}
              sx={{ marginRight: 1, color: theme.palette.text.primary }}
            />
            <Typography variant="body2" color="text.primary">
              Checking auto-merge compatibility...
            </Typography>
          </>
        ) : autoMergePossible ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircle sx={{ color: theme.palette.success.main }} />
            <Typography variant="body2" color="text.primary">
              ✅ Auto-merging is possible.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ErrorOutline sx={{ color: theme.palette.error.main }} />
            <Typography variant="body2" color="text.primary">
              ❌ Auto-merging failed. Fix conflicts manually.
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        ref={commentsContainerRef}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "30vh",

          marginTop: theme.spacing(2),
          paddingRight: theme.spacing(1),
        }}
      >
        <Typography variant="h6" color="text.secondary" mb={1}>
          Comments
        </Typography>
        <Divider sx={{ marginBottom: theme.spacing(1) }} />
        {comments.length === 0 ? (
          <Typography color="textSecondary">No comments yet.</Typography>
        ) : (
          comments.map((comment, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                padding: theme.spacing(1.5),
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[900]
                    : theme.palette.grey[50],
                borderRadius: 2,
                marginBottom: theme.spacing(1.5),
                boxShadow: 1,
              }}
            >
              <Avatar
                src={comment.userAvatar}
                alt={comment.username}
                sx={{
                  marginRight: theme.spacing(1.5),
                  width: 40,
                  height: 40,
                  border: `2px solid ${theme.palette.primary.main}`,
                }}
              />

              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight="bold" color="text.primary">
                  {comment.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(comment.postedAt).toLocaleString()}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: theme.palette.text.primary,
                    marginTop: theme.spacing(0.5),
                    lineHeight: 1.5,
                  }}
                >
                  {comment.content}
                </Typography>
              </Box>

              <IconButton
                color="primary"
                onClick={() => onResolveComment(index)}
                title="Resolve Comment"
                sx={{ alignSelf: "center" }}
              >
                <CheckCircle />
              </IconButton>
            </Box>
          ))
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(2),
          borderRadius: theme.spacing(2),
          boxShadow: `0px -2px 10px ${theme.palette.divider}`,
        }}
      >
        <TextField
          label="Add a General Comment"
          multiline
          rows={2}
          fullWidth
          value={generalCommentText}
          onChange={(e) => setGeneralCommentText(e.target.value)}
          variant="outlined"
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && handleSubmitComment()
          }
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: theme.spacing(3),
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitComment}
            startIcon={<AddComment />}
          >
            Submit Comment
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleMerge}
            startIcon={<MergeType />}
            disabled={!autoMergePossible}
          >
            Merge Changes
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={merged}
        autoHideDuration={2000}
        onClose={() => setMerged(false)}
        message="Successfully merged!"
      />
      {/* Merge Confirmation Dialog */}
      <Dialog open={mergeDialogOpen} onClose={() => setMergeDialogOpen(false)}>
        <DialogTitle>Confirm Merge</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to merge these changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMergeDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmMerge} color="primary" variant="contained">
            Merge
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReviewAndMerge;
