import apiClient from "./apiClient";

export const getAllNasabah = () => apiClient.get("/nasabah").then((res) => res.data.data);

export const createNasabah = (payload) =>
  apiClient.post("/nasabah", payload).then((res) => res.data);

export const updateNasabah = (id, payload) =>
  apiClient.put(`/nasabah/${id}`, payload).then((res) => res.data);

export const deleteNasabah = (id) => apiClient.delete(`/nasabah/${id}`).then((res) => res.data);
