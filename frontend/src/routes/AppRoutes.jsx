/**
 * Daftar Route Aplikasi
 *
 * Mengatur halaman apa yang ditampilkan untuk setiap alamat.
 *
 * Struktur route-nya bertingkat:
 *   /        - halaman awal yang dapat diakses siapa saja
 *   /admin/* - halaman admin, dibungkus dua lapis:
 *                ProtectedRoute - memastikan pengguna sudah masuk
 *                AdminLayout    - menyediakan sidebar dan header bersama
 *
 * Karena bertingkat, kedua pembungkus tersebut cukup ditulis sekali dan
 * berlaku untuk seluruh halaman admin di dalamnya.
 */

import { Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Dashboard from "../pages/Dashboard";
import DataNasabah from "../pages/DataNasabah";
import Transaksi from "../pages/Transaksi";
import JenisSampah from "../pages/JenisSampah";
import Prediksi from "../pages/Prediksi";
import Laporan from "../pages/Laporan";
import Profil from "../pages/Profil";
import PanduanPenggunaan from "../pages/PanduanPenggunaan";
import AdminLayout from "../components/layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

/**
 * Pembungkus halaman awal.
 *
 * LandingPage sudah menyediakan prop onLoginSuccess, sehingga komponen kecil
 * ini hanya perlu mengisinya dengan perintah berpindah ke beranda admin.
 * Dengan cara ini, LandingPage tidak perlu mengetahui urusan navigasi.
 */
function LandingPageRoute() {
  const navigate = useNavigate();
  return <LandingPage onLoginSuccess={() => navigate("/admin/dashboard")} />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Halaman awal, dapat diakses tanpa perlu masuk */}
      <Route path="/" element={<LandingPageRoute />} />

      {/* Seluruh halaman admin wajib masuk terlebih dahulu */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/nasabah" element={<DataNasabah />} />
          <Route path="/admin/transaksi" element={<Transaksi />} />
          <Route path="/admin/jenis-sampah" element={<JenisSampah />} />
          <Route path="/admin/prediksi" element={<Prediksi />} />
          <Route path="/admin/laporan" element={<Laporan />} />
          <Route path="/admin/profil" element={<Profil />} />
          <Route path="/admin/panduan" element={<PanduanPenggunaan />} />
        </Route>
      </Route>
    </Routes>
  );
}
