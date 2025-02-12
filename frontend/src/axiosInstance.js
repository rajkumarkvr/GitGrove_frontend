import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/GitGrove",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosInstance;

// axios.get("https://jsonplaceholder.typicode.com/posts", {
//   params: { userId: 1 }
// })
