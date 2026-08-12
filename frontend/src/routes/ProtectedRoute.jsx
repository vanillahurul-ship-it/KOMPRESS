/**
 * Penjaga Route Admin
 *
 * Memastikan hanya pengguna yang sudah masuk yang dapat membuka halaman
 * admin. Pengguna yang belum masuk dialihkan kembali ke halaman awal.
 *
 * Ini merupakan pengamanan di sisi tampilan saja. Pengamanan sesungguhnya
 * tetap berada di backend melalui authMiddleware, sebab kode di peramban
 * selalu dapat dimodifikasi pengguna.
 *
 * Outlet merupakan tempat React Router menampilkan route anak yang cocok,
 * dalam hal ini AdminLayout beserta isi halamannya.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // Opsi replace dipakai agar halaman admin tidak tersimpan di riwayat
  // peramban, sehingga tombol kembali tidak memantulkan pengguna bolak-balik
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
