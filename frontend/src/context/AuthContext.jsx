/**
 * Context Otentikasi
 *
 * Menyimpan status masuk pengguna dan menyediakannya ke seluruh komponen.
 *
 * Token dan data pengguna disimpan di localStorage agar sesi tetap bertahan
 * ketika halaman dimuat ulang. Token yang tersimpan itu pula yang dibaca
 * apiClient untuk disisipkan pada setiap permintaan ke backend.
 */

import { createContext, useContext, useMemo, useState } from "react";
import * as authApi from "../services/authApi";

const AuthContext = createContext(null);

/**
 * Membaca data pengguna dari localStorage.
 *
 * Dibungkus try/catch karena isi localStorage dapat saja rusak atau bukan
 * JSON yang sah. Bila itu terjadi, pengguna cukup dianggap belum masuk
 * daripada membuat aplikasi gagal ditampilkan.
 *
 * @returns {object|null} Data pengguna, atau null bila tidak ada.
 */
const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Penyedia context otentikasi.
 *
 * Nilai awal state diambil dari localStorage, sehingga pengguna yang sudah
 * masuk tidak perlu masuk lagi setiap kali halaman dimuat ulang.
 *
 * @param {{children: React.ReactNode}} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("access_token"));

  /**
   * Melakukan proses masuk lalu menyimpan sesinya.
   *
   * @param {string} email - Email admin.
   * @param {string} password - Kata sandi admin.
   * @returns {Promise<object>} Response dari backend.
   */
  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("user", JSON.stringify(response.user));
    setToken(response.access_token);
    setUser(response.user);
    return response;
  };

  /**
   * Keluar dari aplikasi dengan menghapus seluruh data sesi.
   *
   * Setelah token dikosongkan, ProtectedRoute akan otomatis mengalihkan
   * pengguna kembali ke halaman awal.
   */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // useMemo mencegah pembuatan objek baru pada setiap render, sehingga
  // komponen yang memakai context ini tidak ikut dirender ulang tanpa perlu
  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook untuk membaca status otentikasi.
 *
 * Melempar error bila dipakai di luar AuthProvider, agar kesalahan penempatan
 * komponen langsung ketahuan alih-alih menghasilkan nilai kosong yang
 * membingungkan.
 *
 * @returns {{user: object|null, token: string|null, isAuthenticated: boolean, login: Function, logout: Function}}
 */
// eslint-disable-next-line react-refresh/only-export-components -- context dan hook-nya sengaja diletakkan pada satu berkas
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
