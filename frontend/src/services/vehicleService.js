import api from "../api/axios";

export async function getAllVehicles() {
  const response = await api.get("/api/vehicles");

  return response.data;
}

export async function addVehicle(vehicle) {
  const response = await api.post("/api/vehicles", vehicle);

  return response.data;
}

export async function updateVehicle(id, vehicle) {
  const response = await api.put(`/api/vehicles/${id}`, vehicle);

  return response.data;
}

export async function deleteVehicle(id) {
  const response = await api.delete(`/api/vehicles/${id}`);

  return response.data;
}

export async function purchaseVehicle(id) {
  const response = await api.post(`/api/vehicles/${id}/purchase`);

  return response.data;
}

export async function restockVehicle(id, quantity) {
  const response = await api.post(`/api/vehicles/${id}/restock`, {
    quantity,
  });

  return response.data;
}

export async function searchVehicle(query) {
  const response = await api.get(
    `/api/vehicles/search?q=${encodeURIComponent(query)}`
  );

  return response.data;
}
