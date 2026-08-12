/**
 * API Transaksi
 *
 * Pemanggilan endpoint /api/transaksi di backend.
 */

import apiClient from "./apiClient";

/**
 * Mengambil seluruh transaksi setoran, terurut dari yang terbaru.
 *
 * @returns {Promise<Array<object>>} Daftar transaksi.
 */
export const getAllTransaksi = () => apiClient.get("/transaksi").then((res) => res.data.data);

/**
 * Mencatat setoran sampah baru.
 *
 * Harga satuan dan total tidak perlu dikirim, karena keduanya dihitung
 * sendiri oleh backend berdasarkan daftar harga yang berlaku.
 *
 * @param {{nama_nasabah: string, jenis_sampah: string, tanggal?: string, berat_kg: number, status?: string}} payload
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const createTransaksi = (payload) =>
  apiClient.post("/transaksi", payload).then((res) => res.data);

/**
 * Memperbarui data transaksi.
 *
 * @param {number|string} id - Id transaksi.
 * @param {object} payload - Data baru.
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const updateTransaksi = (id, payload) =>
  apiClient.put(`/transaksi/${id}`, payload).then((res) => res.data);

/**
 * Mengubah status transaksi saja.
 *
 * Dipakai oleh dropdown status pada tabel transaksi, sehingga perubahan
 * status tidak perlu mengirim ulang seluruh data transaksi.
 *
 * @param {number|string} id - Id transaksi.
 * @param {string} status - Status baru.
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const updateTransaksiStatus = (id, status) =>
  apiClient.patch(`/transaksi/${id}/status`, { status }).then((res) => res.data);

/**
 * Menghapus transaksi.
 *
 * @param {number|string} id - Id transaksi.
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const deleteTransaksi = (id) => apiClient.delete(`/transaksi/${id}`).then((res) => res.data);
