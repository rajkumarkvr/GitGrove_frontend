import React, { useEffect } from "react";
import getToken from "./getAuthToken";
import { useNavigate } from "react-router-dom";
import getCurrentUser from "../Contexts/getCurrentUser";
import { isTokenValid } from "./isValidToken";
import axiosInstance from "../axiosInstance";

export const RequiredAuth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    const currentUser = getCurrentUser();

    console.log("Token:", token);
    console.log("Current User:", currentUser);

    if (
      token == null ||
      currentUser == null ||
      currentUser == {} ||
      Object.keys(currentUser).length == 0
    ) {
      console.log("Invalid or expired token");

      const deleteSession = async () => {
        if (token) {
          try {
            await axiosInstance.post(`/clearsession?expiredToken=${token}`);
          } catch (error) {
            console.error("Error clearing session", error);
          }
        }
      };

      deleteSession();
      if (React.isValidElement(children)) {
        if (children.type.name === "Login") {
          navigate("/login");
        } else if (children.type.name === "Register") {
          navigate("/register");
        } else {
          navigate("/login");
        }
      }
    } else {
      const checkAuth = async () => {
        try {
          await axiosInstance.post("/service/ValidSession");
        } catch (error) {
          console.error("Error checking auth", error);
          navigate("/login");
        }
      };

      console.log("User authenticated");

      if (React.isValidElement(children)) {
        if (
          children.type.name === "Login" ||
          children.type.name === "Register"
        ) {
          navigate("/repositories");
        } else {
          checkAuth();
        }
      }
    }
  }, []);

  return children;
};
