/**
 * API Dashboard
 *
 * Pemanggilan endpoint /api/dashboard di backend.
 */

import apiClient from "./apiClient";

/**
 * Mengambil seluruh data ringkasan untuk halaman beranda.
 *
 * @returns {Promise<object>} Statistik, data grafik, dan cuplikan prediksi.
 */
export const getDashboard = () => apiClient.get("/dashboard").then((res) => res.data.data);
