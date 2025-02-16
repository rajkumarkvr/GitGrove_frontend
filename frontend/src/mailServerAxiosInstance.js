import axios from "axios";

const mailServerAxiosInstance = axios.create({
  baseURL: "http://192.168.43.216:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
export default mailServerAxiosInstance;

// axios.get("https://jsonplaceholder.typicode.com/posts", {
//   params: { userId: 1 }
// })
