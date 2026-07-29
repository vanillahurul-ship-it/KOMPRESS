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

// LandingPage.jsx itself is untouched — this just supplies the navigation
// callback it already expects via its existing `onLoginSuccess` prop.
function LandingPageRoute() {
  const navigate = useNavigate();
  return <LandingPage onLoginSuccess={() => navigate("/admin/dashboard")} />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPageRoute />} />

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
