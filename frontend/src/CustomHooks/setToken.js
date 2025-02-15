import axiosInstance from "../axiosInstance";

export const setAuthToken = (token) => {
  if (token) {
    console.log("token set", token);
    axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};
