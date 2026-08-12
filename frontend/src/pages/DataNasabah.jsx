/**
 * Halaman Data Nasabah
 *
 * Menampilkan daftar nasabah beserta fitur pencarian, penyaringan status,
 * pembagian halaman, serta pengelolaan datanya.
 *
 * Penyaringan dan pembagian halaman dikerjakan di peramban, bukan di backend,
 * karena jumlah nasabah masih tergolong sedikit sehingga seluruh datanya dapat
 * diambil sekaligus. Urutan pengolahannya: data lengkap → disaring → dibagi
 * per halaman.
 */

import { useMemo, useState } from "react";
import Header from "../components/layouts/Header";
import SearchBar from "../components/shared/SearchBar";
import Pagination from "../components/shared/Pagination";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import ButtonTambahNasabah from "../components/dataNasabah/ButtonTambahNasabah";
import NasabahTable from "../components/dataNasabah/NasabahTable";
import TambahNasabahModal from "../components/dataNasabah/TambahNasabahModal";
import StatusFilter from "../components/dataNasabah/StatusFilter";
import useNasabah from "../hooks/useNasabah";
import usePagination from "../hooks/usePagination";
import useDebounce from "../hooks/useDebounce";

export default function DataNasabah() {
  const { data, loading, create, update, remove } = useNasabah();

  // Kata kunci pencarian; nilai yang tertunda dipakai agar penyaringan tidak
  // dijalankan pada setiap ketikan
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  // Penyaring status; teks kosong berarti seluruh status ditampilkan
  const [status, setStatus] = useState("");

  const [showModal, setShowModal] = useState(false);

  // Nasabah yang sedang diubah datanya; bernilai null saat menambah data baru
  const [editingNasabah, setEditingNasabah] = useState(null);

  // Nasabah yang menunggu konfirmasi penghapusan
  const [deletingNasabah, setDeletingNasabah] = useState(null);

  // Menyaring nasabah berdasarkan kata kunci dan status.
  // Pencarian mencakup nama, nomor rekening, dan alamat sekaligus.
  // Dibungkus useMemo agar penyaringan tidak diulang pada setiap render.
  const filteredData = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return data.filter((item) => {
      const nama = item.nama?.toLowerCase() || "";
      const rekening = item.no_rekening?.toLowerCase() || "";
      const alamat = item.alamat?.toLowerCase() || "";
      const matchesSearch = nama.includes(term) || rekening.includes(term) || alamat.includes(term);
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data, debouncedSearch, status]);

  const { page, setPage, totalPages, pageItems } = usePagination(filteredData, 10);

  /** Membuka modal dalam mode tambah data baru. */
  const openNewNasabahModal = () => {
    setEditingNasabah(null);
    setShowModal(true);
  };

  /** Membuka modal dalam mode ubah data. */
  const openEditNasabahModal = (nasabah) => {
    setEditingNasabah(nasabah);
    setShowModal(true);
  };

  /** Menutup modal sekaligus mengosongkan data yang sedang diubah. */
  const closeNasabahModal = () => {
    setShowModal(false);
    setEditingNasabah(null);
  };

  // Satu modal dipakai untuk dua keperluan. Mode ditentukan dari ada atau
  // tidaknya data nasabah yang sedang diubah.
  const handleSubmit = (payload) =>
    editingNasabah ? update(editingNasabah.id, payload) : create(payload);

  /** Menjalankan penghapusan setelah pengguna menekan tombol konfirmasi. */
  const confirmDelete = async () => {
    if (!deletingNasabah) return;
    await remove(deletingNasabah.id);
    setDeletingNasabah(null);
  };

  return (
    <>
      <Header title="Data Nasabah" subtitle="Kelola semua data anggota Bank Sampah Macodes" />

      <div className="admin-content-actions">
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", flex: 1 }}>
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari Nasabah..." />
          <StatusFilter value={status} onChange={setStatus} />
        </div>
        <ButtonTambahNasabah onClick={openNewNasabahModal} />
      </div>

      <NasabahTable
        data={pageItems}
        loading={loading}
        onEdit={openEditNasabahModal}
        onDelete={setDeletingNasabah}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <TambahNasabahModal
        show={showModal}
        onClose={closeNasabahModal}
        onSubmit={handleSubmit}
        initialData={editingNasabah}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingNasabah)}
        onClose={() => setDeletingNasabah(null)}
        onConfirm={confirmDelete}
        title="Hapus Nasabah"
        message={`Apakah Anda yakin ingin menghapus nasabah "${deletingNasabah?.nama}"?`}
        confirmLabel="Hapus"
        danger
      />
    </>
  );
}
