/**
 * API Otentikasi
 *
 * Pemanggilan endpoint /api/auth di backend.
 */

import apiClient from "./apiClient";

/**
 * Mengirim permintaan masuk (login).
 *
 * Berbeda dengan API lain yang langsung mengambil `res.data.data`, fungsi ini
 * mengembalikan seluruh isi response karena access_token berada di tingkat
 * teratas, bukan di dalam field data.
 *
 * @param {string} email - Email admin.
 * @param {string} password - Kata sandi admin.
 * @returns {Promise<{success: boolean, user: object, access_token: string}>}
 */
export const login = (email, password) =>
  apiClient.post("/auth/login", { email, password }).then((res) => res.data);
