/**
 * Halaman Jenis Sampah
 *
 * Mengelola daftar harga sampah. Tata letaknya dibagi dua kolom bersebelahan:
 * form pengisian di sebelah kiri dan daftar data di sebelah kanan, sehingga
 * penambahan maupun perubahan data tidak memerlukan modal.
 *
 * Data yang sedang diubah disimpan di halaman ini karena dipakai bersama oleh
 * kedua komponen tersebut: daftar menentukan baris mana yang dipilih,
 * sedangkan form menampilkan isinya.
 */

import { useState } from "react";
import Header from "../components/layouts/Header";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import JenisSampahForm from "../components/jenisSampah/JenisSampahForm";
import JenisSampahList from "../components/jenisSampah/JenisSampahList";
import useJenisSampah from "../hooks/useJenisSampah";
import usePagination from "../hooks/usePagination";

export default function JenisSampah() {
  const { data, loading, create, update, remove } = useJenisSampah();

  // Jenis sampah yang sedang diubah; bernilai null saat form dalam mode tambah
  const [editingItem, setEditingItem] = useState(null);

  // Jenis sampah yang menunggu konfirmasi penghapusan
  const [deletingItem, setDeletingItem] = useState(null);

  // Enam baris per halaman, menyesuaikan tinggi form di sebelahnya
  const { page, setPage, totalPages, pageItems } = usePagination(data, 6);

  /**
   * Menyimpan data dari form.
   *
   * Setelah perubahan berhasil disimpan, mode ubah dikosongkan supaya form
   * kembali siap dipakai untuk menambah data baru.
   */
  const handleSubmit = async (payload) => {
    if (editingItem) {
      await update(editingItem.id, payload);
      setEditingItem(null);
    } else {
      await create(payload);
    }
  };

  /** Menjalankan penghapusan setelah pengguna menekan tombol konfirmasi. */
  const confirmDelete = async () => {
    if (!deletingItem) return;
    await remove(deletingItem.id);
    setDeletingItem(null);
  };

  return (
    <>
      <Header title="Jenis Sampah" subtitle="Kelola data jenis sampah di Bank Sampah Macodes" />

      <div className="chart-grid" style={{ "--chart-columns": "1fr 1.4fr" }}>
        <JenisSampahForm
          editingItem={editingItem}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingItem(null)}
        />

        <JenisSampahList
          data={pageItems}
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onEdit={setEditingItem}
          onDelete={setDeletingItem}
        />
      </div>

      <ConfirmDialog
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        title="Hapus Jenis Sampah"
        message={`Apakah Anda yakin ingin menghapus "${deletingItem?.nama}"?`}
        confirmLabel="Hapus"
        danger
      />
    </>
  );
}
