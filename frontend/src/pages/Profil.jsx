/**
 * Halaman Profil
 *
 * Menggabungkan tiga bagian pengaturan sistem:
 *   1. Form profil bank sampah (nama, alamat, kontak, logo)
 *   2. Daftar akun admin beserta pengelolaannya
 *   3. Tautan menuju halaman panduan penggunaan
 *
 * Data profil diambil melalui useProfil yang bersumber dari context, sehingga
 * perubahan yang disimpan di sini langsung terlihat pula pada sidebar.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHelpCircle } from "react-icons/fi";
import Header from "../components/layouts/Header";
import ProfilForm from "../components/profil/ProfilForm";
import AdminList from "../components/profil/AdminList";
import AdminViewModal from "../components/profil/AdminViewModal";
import useProfil from "../hooks/useProfil";
import useAdmins from "../hooks/useAdmins";
import "../components/shared/Card.css";

export default function Profil() {
  const { data: profil, update, remove } = useProfil();
  const { admins, loading: adminsLoading, resetPassword, updateName } = useAdmins();

  // Admin yang sedang dilihat detailnya; null berarti modal tertutup
  const [viewingAdmin, setViewingAdmin] = useState(null);

  const navigate = useNavigate();

  return (
    <>
      <Header title="Profil" subtitle="Konfigurasi sistem Bank Sampah Macodes." />

      <div className="chart-grid" style={{ "--chart-columns": "1.2fr 1fr" }}>
        <ProfilForm profil={profil} onSubmit={update} onDelete={remove} />
        <AdminList admins={admins} loading={adminsLoading} onView={setViewingAdmin} />
      </div>

      <section className="shared-card">
        <h2 className="shared-card-title">Bantuan</h2>
        <p className="shared-card-subtitle">Pelajari cara menggunakan setiap fitur di website ini.</p>
        <button
          type="button"
          className="shared-button-primary"
          onClick={() => navigate("/admin/panduan")}
        >
          <FiHelpCircle size={18} />
          <span>Cara Penggunaan Website</span>
        </button>
      </section>

      <AdminViewModal
        admin={viewingAdmin}
        onClose={() => setViewingAdmin(null)}
        onResetPassword={resetPassword}
        onUpdateName={updateName}
      />
    </>
  );
}
