import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ConfirmDialog from "../shared/ConfirmDialog";
import { useAuth } from "../../context/AuthContext";
import { ProfilProvider } from "../../context/ProfilContext";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

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

        {sidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="admin-content-area">
          <div className="admin-mobile-topbar">
            <button
              type="button"
              className="admin-hamburger"
              aria-label="Buka menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
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
