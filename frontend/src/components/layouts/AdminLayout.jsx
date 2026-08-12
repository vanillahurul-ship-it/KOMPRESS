/**
 * Kerangka Halaman Admin
 *
 * Menyediakan tampilan bersama untuk seluruh halaman admin: sidebar navigasi,
 * batang atas untuk layar kecil, dan dialog konfirmasi keluar.
 *
 * Komponen ini juga memasang ProfilProvider, sehingga data profil bank sampah
 * tersedia bagi seluruh halaman admin sekaligus bagi sidebar. Letaknya di sini
 * agar data profil tidak ikut dimuat saat pengunjung membuka halaman awal.
 *
 * Outlet merupakan tempat React Router menampilkan isi halaman yang sedang
 * dibuka, misalnya Beranda atau Transaksi.
 */

import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ConfirmDialog from "../shared/ConfirmDialog";
import { useAuth } from "../../context/AuthContext";
import { ProfilProvider } from "../../context/ProfilContext";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Hanya berpengaruh pada layar kecil, tempat sidebar bersifat laci geser.
  // Pada layar lebar sidebar selalu terlihat, sehingga status ini diabaikan.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  /** Menghapus sesi lalu mengembalikan pengguna ke halaman awal. */
  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  return (
    <ProfilProvider>
      <div className="admin-page">
        <Sidebar
          onLogout={() => setShowLogoutConfirm(true)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Lapisan gelap pada layar kecil; menekannya akan menutup sidebar */}
        {sidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="admin-content-area">
          {/* Batang atas beserta tombol menu, hanya tampil pada layar kecil */}
          <div className="admin-mobile-topbar">
            <button
              type="button"
              className="admin-hamburger"
              aria-label="Buka menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              {/* Tiga elemen ini membentuk ikon tiga garis mendatar */}
              <span />
              <span />
              <span />
            </button>
            <span className="admin-mobile-brand">Bank Sampah Macodes</span>
          </div>

          <Outlet />
        </main>

        <ConfirmDialog
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogoutConfirm}
          title="Konfirmasi Keluar"
          message="Apakah Anda yakin ingin keluar?"
          confirmLabel="Ya"
          cancelLabel="Tidak"
          danger
        />
      </div>
    </ProfilProvider>
  );
}
