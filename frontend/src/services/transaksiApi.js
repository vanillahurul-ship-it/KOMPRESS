import apiClient from "./apiClient";

export const getAllTransaksi = () => apiClient.get("/transaksi").then((res) => res.data.data);

export const createTransaksi = (payload) =>
  apiClient.post("/transaksi", payload).then((res) => res.data);

export const updateTransaksi = (id, payload) =>
  apiClient.put(`/transaksi/${id}`, payload).then((res) => res.data);

export const updateTransaksiStatus = (id, status) =>
  apiClient.patch(`/transaksi/${id}/status`, { status }).then((res) => res.data);

export const deleteTransaksi = (id) => apiClient.delete(`/transaksi/${id}`).then((res) => res.data);
