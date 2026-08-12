/**
 * API Laporan
 *
 * Pemanggilan endpoint /api/laporan di backend.
 */

import apiClient from "./apiClient";

/**
 * Mengambil rekap laporan bulanan.
 *
 * Parameter tahun hanya dikirim bila memang diisi. Bila dikosongkan, backend
 * akan memilih tahun terbaru yang memiliki data.
 *
 * @param {number|string} [tahun] - Tahun yang ingin ditampilkan.
 * @returns {Promise<object>} Data laporan beserta daftar tahun yang tersedia.
 */
export const getLaporan = (tahun) =>
  apiClient.get("/laporan", { params: tahun ? { tahun } : {} }).then((res) => res.data.data);
