/**
 * API Jenis Sampah
 *
 * Pemanggilan endpoint /api/jenis-sampah di backend, yaitu pengelolaan
 * daftar harga sampah.
 */

import apiClient from "./apiClient";

/**
 * Mengambil seluruh jenis sampah beserta harganya.
 *
 * @returns {Promise<Array<object>>} Daftar jenis sampah.
 */
export const getAllJenisSampah = () =>
  apiClient.get("/jenis-sampah").then((res) => res.data.data);

/**
 * Menambahkan jenis sampah baru.
 *
 * @param {{nama: string, harga_per_kg: number, harga_dlh_per_kg: number}} payload
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const createJenisSampah = (payload) =>
  apiClient.post("/jenis-sampah", payload).then((res) => res.data);

/**
 * Memperbarui data jenis sampah.
 *
 * @param {number|string} id - Id jenis sampah.
 * @param {object} payload - Data baru.
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const updateJenisSampah = (id, payload) =>
  apiClient.put(`/jenis-sampah/${id}`, payload).then((res) => res.data);

/**
 * Menghapus jenis sampah.
 *
 * @param {number|string} id - Id jenis sampah.
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const deleteJenisSampah = (id) =>
  apiClient.delete(`/jenis-sampah/${id}`).then((res) => res.data);
