import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Change if your backend uses another port
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;