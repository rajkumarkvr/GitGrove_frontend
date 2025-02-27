import { useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

const CreateRepositoryButton = ({ text }) => {
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CreateNewFolderIcon />}
        onClick={() => navigate("/create-repo")}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "8px",
        }}
      >
        {text}
      </Button>
    </Stack>
  );
};

export default CreateRepositoryButton;
