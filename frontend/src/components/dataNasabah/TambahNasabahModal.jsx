/**
 * Modal Tambah dan Ubah Nasabah
 *
 * Satu modal yang dipakai untuk dua keperluan. Modenya ditentukan dari ada
 * atau tidaknya initialData: bila berisi data, modal berjalan dalam mode ubah.
 *
 * Saldo hanya ditampilkan pada mode ubah dan bersifat hanya-baca, sebab
 * nilainya dihitung backend dari riwayat transaksi dan tidak dapat disunting.
 *
 * @param {object} props
 * @param {boolean} props.show - Menentukan modal terbuka atau tertutup.
 * @param {Function} props.onClose - Menutup modal.
 * @param {Function} props.onSubmit - Menyimpan data; menerima isi form.
 * @param {object} [props.initialData] - Data nasabah yang sedang diubah.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../shared/Modal";
import "../shared/Form.css";
import { requiredRule } from "../../utils/validators";
import { formatCurrency } from "../../utils/formatCurrency";
import { NASABAH_STATUS } from "../../constants/statusOptions";

export default function TambahNasabahModal({ show, onClose, onSubmit, initialData }) {
  const isEditMode = Boolean(initialData?.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nama: "",
      no_rekening: "",
      alamat: "",
      status: "Aktif",
    },
  });

  // Isi ulang form setiap kali modal dibuka: dikosongkan untuk data baru, atau
  // diisi data lama untuk perubahan. Tanpa langkah ini, isian dari pembukaan
  // modal sebelumnya masih akan tertinggal.
  useEffect(() => {
    if (!show) return;
    reset({
      nama: initialData?.nama || "",
      no_rekening: initialData?.no_rekening || "",
      alamat: initialData?.alamat || "",
      status: initialData?.status || "Aktif",
    });
  }, [show, initialData, reset]);

  if (!show) return null;

  /**
   * Menyimpan isi form.
   *
   * Modal hanya ditutup bila penyimpanan berhasil. Bila gagal, error yang
   * dilempar hook membuat baris onClose tidak sempat dijalankan, sehingga
   * isian pengguna tidak hilang begitu saja.
   */
  const submit = async (values) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Modal isOpen={show} onClose={onClose} title={isEditMode ? "Edit Nasabah" : "Tambah Nasabah Baru"}>
      <form onSubmit={handleSubmit(submit)}>
        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="nasabah-nama">Nama Lengkap</label>
          <input id="nasabah-nama" className="shared-form-input" {...register("nama", requiredRule("Nama"))} />
          {errors.nama && <span className="shared-form-error">{errors.nama.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="nasabah-rekening">No Rekening</label>
          <input
            id="nasabah-rekening"
            className="shared-form-input"
            {...register("no_rekening", requiredRule("Nomor rekening"))}
          />
          {errors.no_rekening && <span className="shared-form-error">{errors.no_rekening.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="nasabah-alamat">Alamat</label>
          <input id="nasabah-alamat" className="shared-form-input" {...register("alamat", requiredRule("Alamat"))} />
          {errors.alamat && <span className="shared-form-error">{errors.alamat.message}</span>}
        </div>

        {/* Saldo hanya ditampilkan saat mengubah data, dan tidak dapat disunting
            karena nilainya dihitung otomatis dari riwayat transaksi */}
        {isEditMode && (
          <div className="shared-form-field">
            <label className="shared-form-label">Saldo (Rp)</label>
            <input
              className="shared-form-input readonly"
              readOnly
              value={formatCurrency(initialData?.saldo ?? 0)}
            />
          </div>
        )}

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="nasabah-status">Status</label>
          <select id="nasabah-status" className="shared-form-select" {...register("status")}>
            {NASABAH_STATUS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="shared-form-actions">
          <button type="button" className="shared-form-cancel" onClick={onClose}>Batal</button>
          <button type="submit" className="shared-form-submit" disabled={isSubmitting}>
            {isEditMode ? "Simpan" : "Tambah"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
