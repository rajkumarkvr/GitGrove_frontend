import { useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUploadButton = ({ username, reponame }) => {
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={2} sx={{ mt: 8 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={() => navigate(`/repo/fileupload/${username}/${reponame}`)}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "8px",
        }}
      >
        Upload File
      </Button>
    </Stack>
  );
};

export default FileUploadButton;
