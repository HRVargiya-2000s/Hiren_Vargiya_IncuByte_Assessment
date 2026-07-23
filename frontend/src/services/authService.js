import api from "../api/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/api/auth/login", credentials);

  return response.data;
};

export const registerUser = async (payload) => {
  const response = await api.post("/api/auth/register", payload);

  return response.data;
};
