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
  Popover,
  Box,
} from "@mui/material";
import {
  AddComment,
  CheckCircle,
  ChatBubbleOutline,
} from "@mui/icons-material";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import { useState } from "react";

const ReviewAndMerge = ({
  oldCode,
  newCode,
  comments,
  onAddComment,
  onResolveComment,
  onMerge,
}) => {
  const theme = useTheme();
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [inlineCommentText, setInlineCommentText] = useState("");
  const [generalCommentText, setGeneralCommentText] = useState("");

  // Handle inline comment popup
  const handleLineClick = (event, lineNumber) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddInlineComment = () => {
    if (inlineCommentText.trim()) {
      onAddComment({
        text: inlineCommentText,
        lineNumber: anchorEl?.dataset?.lineNumber,
      });
      setInlineCommentText("");
      setAnchorEl(null);
    }
  };

  const handleAddGeneralComment = () => {
    if (generalCommentText.trim()) {
      onAddComment({ text: generalCommentText });
      setGeneralCommentText("");
    }
  };

  // Handle merge action
  const handleMerge = () => {
    setMergeDialogOpen(true);
  };

  const confirmMerge = () => {
    onMerge();
    setMergeDialogOpen(false);
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
        height: "80vh", // Fixed height for proper structure
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          marginBottom: theme.spacing(2),
          color: theme.palette.text.primary,
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Pull Request Review
      </Typography>

      {/* Code Diffs */}
      <Box sx={{ overflowX: "auto", flexGrow: 1 }}>
        <ReactDiffViewer
          oldValue={oldCode}
          newValue={newCode}
          splitView={true}
          compareMethod={DiffMethod.LINES}
          styles={{
            diffContainer: {
              backgroundColor: theme.palette.background.default,
            },
            gutter: {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[200],
            },
            line: { wordBreak: "break-word", cursor: "pointer" },
            added: {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.success.dark
                  : theme.palette.success.light,
            },
            removed: {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.error.dark
                  : theme.palette.error.light,
            },
          }}
          onLineNumberClick={(lineId, event) => handleLineClick(event, lineId)}
        />
      </Box>

      {/* Inline Comment Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ padding: theme.spacing(2), maxWidth: 300 }}>
          <TextField
            label="Add Inline Comment"
            multiline
            rows={2}
            value={inlineCommentText}
            onChange={(e) => setInlineCommentText(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: theme.spacing(1) }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddInlineComment}
            fullWidth
            startIcon={<AddComment />}
          >
            Add Comment
          </Button>
        </Box>
      </Popover>

      {/* Comments Section */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "25vh",
          marginTop: theme.spacing(2),
          paddingRight: theme.spacing(1),
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            marginBottom: theme.spacing(1),
          }}
        >
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
                alignItems: "center",
                padding: theme.spacing(1),
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.grey[100],
                borderRadius: 1,
                marginBottom: theme.spacing(1),
              }}
            >
              <ChatBubbleOutline sx={{ marginRight: theme.spacing(1) }} />
              <Typography sx={{ flexGrow: 1 }}>
                {comment.text}{" "}
                {comment.lineNumber && `(Line ${comment.lineNumber})`}
              </Typography>
              <IconButton
                color="primary"
                onClick={() => onResolveComment(index)}
                title="Resolve Comment"
              >
                <CheckCircle />
              </IconButton>
            </Box>
          ))
        )}
      </Box>

      {/* Fixed Comment Input and Merge Button */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          bottom: 0,
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
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: theme.spacing(2),
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGeneralComment}
            startIcon={<AddComment />}
          >
            Submit Comment
          </Button>
          <Button variant="contained" color="secondary" onClick={handleMerge}>
            Merge Changes
          </Button>
        </Box>
      </Box>
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
