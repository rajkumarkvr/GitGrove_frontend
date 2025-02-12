import { ThemeContext } from "@emotion/react";
import { Switch } from "@mui/material";
import { useContext } from "react";

const ThemeToggle = ({ mode, toggleTheme }) => {
  console.log(mode);
  return <Switch onChange={toggleTheme} />;
};

export default ThemeToggle;
