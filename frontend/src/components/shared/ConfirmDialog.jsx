/**
 * Komponen Dialog Konfirmasi
 *
 * Jendela konfirmasi ya/tidak yang dibangun di atas komponen Modal. Dipakai
 * untuk memastikan tindakan yang tidak dapat dibatalkan, seperti menghapus
 * data dan keluar dari aplikasi.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Menentukan dialog terbuka atau tertutup.
 * @param {Function} props.onClose - Dipanggil saat dialog dibatalkan.
 * @param {Function} props.onConfirm - Dipanggil saat tindakan disetujui.
 * @param {string} [props.title="Konfirmasi"] - Judul dialog.
 * @param {string} props.message - Pertanyaan yang ditampilkan.
 * @param {string} [props.confirmLabel="Ya"] - Tulisan pada tombol setuju.
 * @param {string} [props.cancelLabel="Tidak"] - Tulisan pada tombol batal.
 * @param {boolean} [props.danger=false] - Bila true, tombol setuju diberi
 *        warna merah sebagai penanda tindakan berisiko.
 */

import Modal from "./Modal";
import "./ConfirmDialog.css";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message,
  confirmLabel = "Ya",
  cancelLabel = "Tidak",
  danger = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="380px">
      <p className="confirm-dialog-message">{message}</p>
      <div className="confirm-dialog-actions">
        <button type="button" className="confirm-dialog-cancel" onClick={onClose}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`confirm-dialog-confirm ${danger ? "danger" : ""}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
