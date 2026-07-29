import apiClient from "./apiClient";

export const getLaporan = (tahun) =>
  apiClient.get("/laporan", { params: tahun ? { tahun } : {} }).then((res) => res.data.data);
