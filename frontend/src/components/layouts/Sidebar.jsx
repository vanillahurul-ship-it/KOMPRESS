/**
 * Sidebar Navigasi Admin
 *
 * Menampilkan logo, identitas pengguna, daftar menu, dan tombol keluar.
 *
 * Logo diambil dari data profil bank sampah, sehingga logo yang diunggah di
 * halaman Profil langsung terlihat di sini. Bila belum ada logo yang diunggah,
 * dipakai logo bawaan aplikasi.
 *
 * @param {object} props
 * @param {Function} props.onLogout - Dipanggil saat tombol keluar ditekan.
 * @param {boolean} [props.isOpen=false] - Keadaan laci sidebar pada layar kecil.
 * @param {Function} props.onClose - Menutup laci sidebar pada layar kecil.
 */

import { NavLink } from "react-router-dom";
import defaultLogo from "../../assets/icons/logobanksampah.png";
import useProfil from "../../hooks/useProfil";
import berandaIcon from "../../assets/icons/beranda.svg";
import dataNasabahIcon from "../../assets/icons/datanasabah.svg";
import transaksiIcon from "../../assets/icons/transaksi.svg";
import jenisSampahIcon from "../../assets/icons/jenissampah.svg";
import prediksiIcon from "../../assets/icons/prediksi.svg";
import laporanIcon from "../../assets/icons/laporan.svg";
import profilIcon from "../../assets/icons/profile.svg";
import keluarIcon from "../../assets/icons/keluar.svg";

// Daftar menu sidebar. Urutannya di sini menentukan urutan tampilannya,
// dan alamat tujuannya harus sama dengan yang didaftarkan di AppRoutes.jsx.
const menuItems = [
  { label: "Beranda", icon: berandaIcon, to: "/admin/dashboard" },
  { label: "Data Nasabah", icon: dataNasabahIcon, to: "/admin/nasabah" },
  { label: "Transaksi", icon: transaksiIcon, to: "/admin/transaksi" },
  { label: "Jenis Sampah", icon: jenisSampahIcon, to: "/admin/jenis-sampah" },
  { label: "Prediksi", icon: prediksiIcon, to: "/admin/prediksi" },
  { label: "Laporan", icon: laporanIcon, to: "/admin/laporan" },
  { label: "Profil", icon: profilIcon, to: "/admin/profil" },
];

export default function Sidebar({ onLogout, isOpen = false, onClose }) {
  const { data: profil } = useProfil();

  // Pakai logo yang diunggah admin bila tersedia, jika tidak pakai logo bawaan
  const logoSrc = profil?.logo_url || defaultLogo;

  return (
    <aside className={`sidebar-container ${isOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <img src={logoSrc} alt="Bank Sampah Logo" />
        <div className="sidebar-brand">
          <span className="brand-name">MACODES</span>
          <span className="brand-subtitle">Bank Sampah</span>
        </div>
      </div>

      <div className="sidebar-admin-card">
        <div className="admin-avatar">A</div>
        <div className="admin-text">
          <span>Administrator</span>
          <strong>Admin Macodes</strong>
        </div>
      </div>

      <nav className="sidebar-menu" aria-label="Sidebar navigation">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            // NavLink menandai sendiri menu yang sedang aktif berdasarkan
            // alamat halaman yang sedang dibuka
            className={({ isActive }) => `sidebar-menu-item ${isActive ? "active" : ""}`}
            // Pada layar kecil, memilih menu sekaligus menutup laci sidebar
            onClick={onClose}
          >
            <img src={item.icon} alt="" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-logout" onClick={onLogout}>
          <img src={keluarIcon} alt="" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
