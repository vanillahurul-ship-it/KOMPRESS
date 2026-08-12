/**
 * Klien API
 *
 * Instance axios yang dipakai bersama oleh seluruh berkas api di folder ini.
 * Dua hal yang diatur secara terpusat di sini:
 *
 *   1. Penyisipan token login pada setiap permintaan, sehingga tidak perlu
 *      ditulis berulang di setiap pemanggilan API.
 *   2. Penyeragaman pesan error, sehingga komponen cukup membaca
 *      `error.message` tanpa perlu menelusuri struktur response axios.
 *
 * Alamat backend diambil dari variabel lingkungan VITE_API_URL agar alamat
 * saat pengembangan dan saat produksi dapat dibedakan tanpa mengubah kode.
 */

import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({ baseURL });

/**
 * Interceptor permintaan.
 *
 * Menyisipkan header Authorization berisi token yang tersimpan di
 * localStorage. Bila token belum ada (pengguna belum masuk), permintaan tetap
 * dikirim tanpa header dan backend yang akan menolaknya.
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor response.
 *
 * Mengubah berbagai bentuk kegagalan menjadi satu Error dengan pesan yang
 * siap ditampilkan. Urutan pencarian pesannya:
 *   1. Pesan dari backend (error.response.data.message)
 *   2. Pesan bawaan axios, misalnya saat jaringan terputus
 *   3. Pesan umum sebagai cadangan terakhir
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Terjadi kesalahan pada server";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
