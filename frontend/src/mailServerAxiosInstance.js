import axios from "axios";

const mailServerAxiosInstance = axios.create({
  baseURL: "http://172.17.23.190:5000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
export default mailServerAxiosInstance;

// axios.get("https://jsonplaceholder.typicode.com/posts", {
//   params: { userId: 1 }
// })
