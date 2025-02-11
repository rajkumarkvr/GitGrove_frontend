import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProviderWrapper } from "./ThemeContext.jsx";
import UserContextProvider from "./Contexts/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProviderWrapper>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </ThemeProviderWrapper>
  </StrictMode>
);
