import api from "../api/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/api/auth/login", credentials);

  return response.data;
};

export const registerUser = async (payload) => {
  const response = await api.post("/api/auth/register", payload);

  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get("/api/auth/users");
  return response.data;
};

export const updateRole = async (userId, role) => {
  const response = await api.put(`/api/auth/users/${userId}/role`, { role });
  return response.data;
};
