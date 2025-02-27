import axios from "axios";

const mailServerAxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
export default mailServerAxiosInstance;

// axios.get("https://jsonplaceholder.typicode.com/posts", {
//   params: { userId: 1 }
// })
