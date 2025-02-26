import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProviderWrapper } from "./ThemeContext.jsx";
import UserContextProvider from "./Contexts/UserContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
const CLIENT_ID =
  "729821878360-c7sk6p6rggp3fdtobk3jcc033q35mvbp.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <ThemeProviderWrapper>
    <UserContextProvider>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </UserContextProvider>
  </ThemeProviderWrapper>
);
