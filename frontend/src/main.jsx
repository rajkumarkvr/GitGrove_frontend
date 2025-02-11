import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProviderWrapper } from "./ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProviderWrapper>
      <App />
    </ThemeProviderWrapper>
  </StrictMode>
);
