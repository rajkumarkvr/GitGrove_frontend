const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// const folderName  = "../Frontend/"

let mainPath = "/home/raj-zstk371/Documents/GitGrove_frontend/frontend/";
app.use(express.static(path.join(mainPath, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(mainPath, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
