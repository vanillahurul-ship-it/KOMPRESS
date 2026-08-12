/**
 * Modal Detail Admin
 *
 * Menampilkan nama dan email seorang admin, sekaligus menyediakan dua tindakan
 * yang berdiri sendiri: mengubah nama dan menetapkan kata sandi baru.
 *
 * Kata sandi yang sedang berlaku tidak dapat ditampilkan, karena Supabase Auth
 * menyimpannya dalam bentuk terenkripsi dan tidak pernah mengembalikannya,
 * bahkan dengan hak akses tertinggi sekalipun. Karena itu yang tersedia di sini
 * adalah penetapan kata sandi baru, bukan penampilan kata sandi lama.
 *
 * @param {object} props
 * @param {object|null} props.admin - Admin yang dilihat; null menutup modal.
 * @param {Function} props.onClose - Menutup modal.
 * @param {Function} props.onResetPassword - Menyimpan kata sandi baru.
 * @param {Function} props.onUpdateName - Menyimpan nama baru.
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../shared/Modal";
import "../shared/Form.css";
import { passwordRule } from "../../utils/validators";
import eyeOpen from "../../assets/icons/login/matabuka.svg";
import eyeClosed from "../../assets/icons/login/mata tutup.svg";
import editIcon from "../../assets/icons/datanasabah/editnasabah.svg";

export default function AdminViewModal({ admin, onClose, onResetPassword, onUpdateName }) {
  const [showPassword, setShowPassword] = useState(false);

  // Menentukan isian nama sedang dalam mode ubah atau hanya-baca
  const [isEditingName, setIsEditingName] = useState(false);

  // Nama yang sedang diketik. Disimpan terpisah dari react-hook-form karena
  // penyimpanannya berdiri sendiri, tidak ikut tombol kirim form kata sandi.
  const [nameValue, setNameValue] = useState("");

  const [savingName, setSavingName] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { password: "" } });

  // Kembalikan seluruh isian ke keadaan awal setiap kali admin yang dilihat
  // berganti, agar kata sandi yang sempat diketik untuk admin sebelumnya tidak
  // tertinggal di layar
  useEffect(() => {
    reset({ password: "" });
    setShowPassword(false);
    setIsEditingName(false);
    setNameValue(admin?.nama || "");
  }, [admin, reset]);

  if (!admin) return null;

  /** Menyimpan kata sandi baru lalu menutup modal. */
  const submit = async (values) => {
    await onResetPassword(admin.id, values.password);
    reset({ password: "" });
    onClose();
  };

  /**
   * Menangani tombol di samping isian nama.
   *
   * Tombol ini memiliki dua peran bergantian: membuka mode ubah, lalu
   * menyimpan perubahannya.
   *
   * Bila nama dikosongkan atau tidak berubah, penyimpanan dilewati dan isian
   * dikembalikan ke nilai semula, supaya tidak ada permintaan sia-sia ke server.
   */
  const handleEditNameClick = async () => {
    if (!isEditingName) {
      setIsEditingName(true);
      return;
    }
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed === admin.nama) {
      setIsEditingName(false);
      setNameValue(admin.nama || "");
      return;
    }
    setSavingName(true);
    try {
      await onUpdateName(admin.id, trimmed);
      setIsEditingName(false);
    } finally {
      setSavingName(false);
    }
  };

  return (
    <Modal isOpen={Boolean(admin)} onClose={onClose} title="Detail Admin" maxWidth="360px">
      <div className="shared-form-field">
        <label className="shared-form-label">Nama</label>
        <div className="shared-password-wrapper">
          <input
            className={`shared-form-input${isEditingName ? "" : " readonly"}`}
            readOnly={!isEditingName}
            value={isEditingName ? nameValue : admin?.nama || "-"}
            onChange={(event) => setNameValue(event.target.value)}
            style={isEditingName ? { paddingRight: 68 } : undefined}
          />
          <button
            type="button"
            className="shared-password-toggle"
            onClick={handleEditNameClick}
            disabled={savingName}
            aria-label={isEditingName ? "Simpan nama" : "Edit nama"}
          >
            {isEditingName ? (
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--admin-primary, #546B41)" }}>
                {savingName ? "..." : "Simpan"}
              </span>
            ) : (
              <img src={editIcon} alt="" />
            )}
          </button>
        </div>
      </div>
      <div className="shared-form-field">
        <label className="shared-form-label">Email</label>
        <input className="shared-form-input readonly" readOnly value={admin?.email || "-"} />
      </div>

      <form onSubmit={handleSubmit(submit)}>
        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="admin-new-password">Set Password Baru</label>
          <div className="shared-password-wrapper">
            <input
              id="admin-new-password"
              type={showPassword ? "text" : "password"}
              className="shared-form-input"
              placeholder="Masukkan password baru"
              {...register("password", passwordRule)}
            />
            <button
              type="button"
              className="shared-password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            >
              <img src={showPassword ? eyeOpen : eyeClosed} alt="" />
            </button>
          </div>
          {errors.password && <span className="shared-form-error">{errors.password.message}</span>}
        </div>

        <div className="shared-form-actions">
          <button type="button" className="shared-form-cancel" onClick={onClose}>Batal</button>
          <button type="submit" className="shared-form-submit" disabled={isSubmitting}>
            Simpan Password
          </button>
        </div>
      </form>
    </Modal>
  );
}
