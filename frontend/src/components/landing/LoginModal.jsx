/**
 * Modal Masuk Admin
 *
 * Form masuk yang muncul dari halaman awal.
 *
 * Modal ini menerima dua penanda keadaan yang berbeda dari komponen induk:
 *   isOpen    - modal masih berada di halaman
 *   isVisible - modal dalam keadaan terlihat penuh
 *
 * Pemisahan tersebut memungkinkan modal menampilkan animasi memudar sebelum
 * benar-benar dilepas dari halaman. Setelah animasinya selesai, komponen ini
 * memberi tahu induknya melalui onCloseComplete.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Modal masih dipasang di halaman.
 * @param {boolean} props.isVisible - Modal sedang terlihat.
 * @param {Function} props.onClose - Memulai proses penutupan.
 * @param {Function} props.onCloseComplete - Dipanggil setelah animasi selesai.
 * @param {Function} props.onLoginSuccess - Dipanggil setelah berhasil masuk.
 */

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "./LoginModal.css";
import logobanksampah from "../../assets/icons/logobanksampah.png";
import eyeOpen from "../../assets/icons/login/matabuka.svg";
import eyeClosed from "../../assets/icons/login/mata tutup.svg";
import adminProfile from "../../assets/icons/profiladmin.svg";
import closeIcon from "../../assets/icons/login/silang.svg";
import { useAuth } from "../../context/AuthContext";

function LoginModal({ isOpen, isVisible, onClose, onCloseComplete, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Beri tahu induk setelah animasi memudar selesai, agar modal dilepas dari
  // halaman. Jeda 300 milidetik disesuaikan dengan durasi animasi di
  // LoginModal.css; bila durasi di berkas gaya diubah, angka ini perlu
  // disesuaikan pula.
  useEffect(() => {
    if (!isVisible && isOpen) {
      const timeout = setTimeout(() => {
        onCloseComplete();
      }, 300);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isOpen, isVisible, onCloseComplete]);

  /**
   * Menjalankan proses masuk.
   *
   * Penyimpanan token dan data pengguna ditangani AuthContext, sehingga
   * komponen ini cukup mengurus tampilan dan pemberitahuannya saja.
   *
   * Modal tidak ditutup sendiri di sini; penutupannya terjadi karena halaman
   * berpindah ke beranda admin melalui onLoginSuccess.
   */
  const handleLogin = async (event) => {
    // Cegah peramban memuat ulang halaman saat form dikirim
    event.preventDefault();

    try {
      setLoading(true);

      await login(email, password);
      toast.success("Berhasil Masuk");

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      toast.error(error.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className="login-modal-root">
      <div
        className={`login-modal-backdrop ${isVisible ? "visible" : ""}`}
        onClick={onClose}
      />

      <div className={`login-modal-container ${isVisible ? "visible" : ""}`}>
        <div className="login-modal-header">
          <div className="login-modal-logo-group">
            <div className="login-modal-logo-badge">
              <img src={logobanksampah} alt="Logo Bank Sampah Macodes" />
            </div>
            <div className="login-modal-logo-text">
              <span className="login-modal-logo-title">MACODES</span>
              <span className="login-modal-logo-subtitle">Bank Sampah</span>
            </div>
          </div>

          <button type="button" className="login-modal-close" onClick={onClose}>
            <img src={closeIcon} alt="Tutup" />
          </button>
        </div>

        <h2 className="login-modal-title">Selamat Datang, Admin!</h2>
        <p className="login-modal-description">
          Masuk ke panel manajemen Bank Sampah Macodes untuk mengelola data dan layanan.
        </p>

        <p className="login-modal-section-label">Masuk sebagai:</p>
        <div className="login-modal-admin-card">
          <div className="login-modal-admin-avatar">
            <img src={adminProfile} alt="Admin" />
          </div>
          <div className="login-modal-admin-text">
            <p className="login-modal-admin-name">Admin</p>
            <p className="login-modal-admin-role">Pengelola Bank Sampah</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-modal-form">
          <div className="login-modal-field">
            <label className="login-modal-label" htmlFor="admin-email">
              EMAIL
            </label>
            <input
               id="admin-email"
               type="email"
               placeholder="admin@macodes.com"
               className="login-modal-input"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-modal-field">
            <label className="login-modal-label" htmlFor="admin-password">
              PASSWORD
            </label>
            <div className="login-modal-password-wrapper">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                className="login-modal-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="login-modal-eye-button"
                onClick={() => setShowPassword((current) => !current)}
              >
                <img
                  src={showPassword ? eyeOpen : eyeClosed}
                  alt={showPassword ? "Sembunyikan password" : "Lihat password"}
                />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-modal-submit"
            disabled={loading}
        >
            {loading ? "Loading..." : "MASUK"}
        </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
