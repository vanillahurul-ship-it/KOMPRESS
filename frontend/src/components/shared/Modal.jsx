/**
 * Komponen Modal
 *
 * Jendela sembul (modal) serbaguna dengan latar belakang buram, memakai gaya
 * tampilan yang sama dengan modal login di halaman awal.
 *
 * Contoh pemakaian:
 *   <Modal isOpen={open} onClose={close} title="Tambah Nasabah">
 *     ...isi form...
 *   </Modal>
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Menentukan modal terbuka atau tertutup.
 * @param {Function} props.onClose - Dipanggil saat modal hendak ditutup.
 * @param {string} props.title - Judul yang tampil di bagian atas modal.
 * @param {React.ReactNode} props.children - Isi modal.
 * @param {string} [props.maxWidth] - Lebar maksimal, misalnya "380px".
 */

import { useEffect, useState } from "react";
import "./Modal.css";

export default function Modal({ isOpen, onClose, title, children, maxWidth }) {
  // Dua status yang bekerja bersama untuk menghasilkan animasi:
  //   mounted - modal masih berada di dalam halaman
  //   visible - modal dalam keadaan terlihat penuh
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Modal ditampilkan dahulu dalam keadaan transparan, baru pada frame
      // berikutnya diubah menjadi terlihat. Jeda satu frame ini diperlukan
      // agar peramban sempat mencatat keadaan awal, sehingga animasinya
      // benar-benar berjalan dan bukan langsung melompat ke keadaan akhir.
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    // Saat ditutup, modal dibuat memudar lebih dahulu, lalu baru dilepas dari
    // halaman. Jeda 300 milidetik disesuaikan dengan durasi animasi di Modal.css.
    setVisible(false);
    const timeout = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div className="shared-modal-root">
      {/* Menekan area gelap di luar modal ikut menutup modal */}
      <div className="shared-modal-backdrop" onClick={onClose} />
      <div
        className={`shared-modal-container ${visible ? "visible" : ""}`}
        style={maxWidth ? { "--shared-modal-max-width": maxWidth } : undefined}
      >
        <div className="shared-modal-header">
          <h2 className="shared-modal-title">{title}</h2>
          <button type="button" className="shared-modal-close" onClick={onClose} aria-label="Tutup">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
