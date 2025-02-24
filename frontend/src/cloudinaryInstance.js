import axios from "axios";

const cloudinaryInstance = axios.create({
  baseURL: "http://172.17.23.190:8080/GitGrove",
  timeout: 10000,
});
export default cloudinaryInstance;
