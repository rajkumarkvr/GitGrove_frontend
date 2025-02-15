import React, { useEffect } from "react";
import getToken from "./getAuthToken";
import { useNavigate } from "react-router-dom";
import getCurrentUser from "../Contexts/getCurrentUser";
import Login from "../Pages/Login/Login";
import { isTokenValid } from "./isValidToken";
import axiosInstance from "../axiosInstance";

export const RequiredAuth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      getToken() == null ||
      getCurrentUser == null ||
      !isTokenValid(getToken())
    ) {
      const deleteSession = async () => {
        const token = getToken();
        if (token != null) {
          console.log("deuhgugsayg");
          try {
            const response = await axiosInstance.post(
              `/clearsession?expiredToken=${token}`
            );
            console.log(response.data);
          } catch (error) {
            console.log("Error to clear session");
            console.log(error);
          }
        }
      };
      deleteSession();
      if (children.type.name == "Login") {
        navigate("/login");
      } else if (children.type.name == "Register") {
        navigate("/register");
      } else {
        navigate("/login");
        return;
      }
    }

    const checkAuth = async () => {
      try {
        const response = await axiosInstance.post("/service/ValidSession");
        console.log(response.data);
      } catch (error) {
        console.log("Error checking auth");
        console.log(error);
        navigate("/login");
      }
    };

    console.log("not null");
    if (getCurrentUser != null) {
      console.log("curr not null");

      if (children.type.name == "Login" || children.type.name == "Register") {
        navigate("/repositories");
      } else {
        checkAuth();
      }
    }
  }, []);

  return children;
};
