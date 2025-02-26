import axios from "axios";
import { setAuthToken } from "./CustomHooks/setToken";
import getToken from "./CustomHooks/getAuthToken";

const axiosInstance = axios.create({
  baseURL: "http://172.17.23.190:8080/GitGrove",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
setAuthToken(getToken());

// axios.get("https://jsonplaceholder.typicode.com/posts", {
//   params: { userId: 1 }
// })
