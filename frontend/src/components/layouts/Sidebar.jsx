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

const menuItems = [
  { label: "Beranda", icon: berandaIcon, to: "/admin/dashboard" },
  { label: "Data Nasabah", icon: dataNasabahIcon, to: "/admin/nasabah" },
  { label: "Transaksi", icon: transaksiIcon, to: "/admin/transaksi" },
  { label: "Jenis Sampah", icon: jenisSampahIcon, to: "/admin/jenis-sampah" },
  { label: "Prediksi", icon: prediksiIcon, to: "/admin/prediksi" },
  { label: "Laporan", icon: laporanIcon, to: "/admin/laporan" },
  { label: "Profil", icon: profilIcon, to: "/admin/profil" },
];

// `isOpen`/`onClose` only matter below the drawer breakpoint (see AdminLayout.css) —
// on desktop the sidebar is always visible and these are effectively no-ops.
export default function Sidebar({ onLogout, isOpen = false, onClose }) {
  const { data: profil } = useProfil();
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
            className={({ isActive }) => `sidebar-menu-item ${isActive ? "active" : ""}`}
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
