/**
 * API Nasabah
 *
 * Pemanggilan endpoint /api/nasabah di backend.
 */

import apiClient from "./apiClient";

/**
 * Mengambil daftar seluruh nasabah beserta saldonya.
 *
 * @returns {Promise<Array<object>>} Daftar nasabah.
 */
export const getAllNasabah = () => apiClient.get("/nasabah").then((res) => res.data.data);

/**
 * Menambahkan nasabah baru.
 *
 * @param {{nama: string, no_rekening: string, alamat: string, status?: string}} payload
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const createNasabah = (payload) =>
  apiClient.post("/nasabah", payload).then((res) => res.data);

/**
 * Memperbarui data nasabah.
 *
 * @param {number|string} id - Id nasabah.
 * @param {object} payload - Data baru.
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const updateNasabah = (id, payload) =>
  apiClient.put(`/nasabah/${id}`, payload).then((res) => res.data);

/**
 * Menghapus nasabah.
 *
 * @param {number|string} id - Id nasabah.
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const deleteNasabah = (id) => apiClient.delete(`/nasabah/${id}`).then((res) => res.data);
