import apiClient from "./apiClient";

export const getAllJenisSampah = () =>
  apiClient.get("/jenis-sampah").then((res) => res.data.data);

export const createJenisSampah = (payload) =>
  apiClient.post("/jenis-sampah", payload).then((res) => res.data);

export const updateJenisSampah = (id, payload) =>
  apiClient.put(`/jenis-sampah/${id}`, payload).then((res) => res.data);

export const deleteJenisSampah = (id) =>
  apiClient.delete(`/jenis-sampah/${id}`).then((res) => res.data);
