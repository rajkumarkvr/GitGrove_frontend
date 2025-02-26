import axios from "axios";

const cloudinaryInstance = axios.create({
  baseURL: "http://localhost:8080/GitGrove",
  timeout: 10000,
});
export default cloudinaryInstance;
