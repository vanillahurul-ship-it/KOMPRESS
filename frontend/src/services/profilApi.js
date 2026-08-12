/**
 * API Profil
 *
 * Pemanggilan endpoint /api/profil di backend, mencakup data profil bank
 * sampah sekaligus pengelolaan akun admin.
 */

import apiClient from "./apiClient";

/**
 * Mengambil data profil bank sampah.
 *
 * @returns {Promise<object|null>} Data profil, atau null bila belum diisi.
 */
export const getProfil = () => apiClient.get("/profil").then((res) => res.data.data);

/**
 * Menyimpan perubahan profil bank sampah.
 *
 * Data dikirim sebagai FormData, bukan JSON, karena permintaan ini bisa
 * disertai berkas logo. Field bernilai undefined atau null sengaja tidak
 * disertakan supaya backend memperlakukannya sebagai field yang tidak diubah.
 *
 * Berkas logo hanya dilampirkan bila benar-benar berupa File, sebab saat
 * pengguna tidak mengganti logo, nilai yang tersimpan di form masih berupa
 * teks URL logo lama.
 *
 * @param {object} payload - Field profil, boleh disertai `logo` bertipe File.
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const updateProfil = (payload) => {
  const { logo, ...fields } = payload;
  const form = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, value);
  });
  if (logo instanceof File) form.append("logo", logo);

  return apiClient
    .put("/profil", form, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => res.data);
};

/**
 * Menghapus data profil bank sampah.
 *
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const deleteProfil = () => apiClient.delete("/profil").then((res) => res.data);

/**
 * Mengambil daftar akun admin.
 *
 * @returns {Promise<Array<{id: string, nama: string, email: string}>>} Daftar admin.
 */
export const listAdmins = () => apiClient.get("/profil/admins").then((res) => res.data.data);

/**
 * Menyetel ulang kata sandi seorang admin.
 *
 * @param {string} id - Id admin.
 * @param {string} password - Kata sandi baru, minimal 8 karakter.
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const resetAdminPassword = (id, password) =>
  apiClient.patch(`/profil/admins/${id}/password`, { password }).then((res) => res.data);

/**
 * Mengubah nama tampilan seorang admin.
 *
 * @param {string} id - Id admin.
 * @param {string} name - Nama baru.
 * @returns {Promise<object>} Response backend beserta pesan keberhasilan.
 */
export const updateAdminName = (id, name) =>
  apiClient.patch(`/profil/admins/${id}/name`, { name }).then((res) => res.data);
