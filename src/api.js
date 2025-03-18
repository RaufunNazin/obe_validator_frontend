import axios from "axios";

export default axios.create({
  baseURL: `obevalidatorbackend-production.up.railway.app/`,
  timeout: 1200000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});