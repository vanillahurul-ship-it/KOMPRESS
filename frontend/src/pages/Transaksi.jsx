/**
 * Halaman Transaksi
 *
 * Menampilkan seluruh setoran sampah beserta fitur pencarian, penyaringan
 * tahun, pembagian halaman, dan pengelolaan datanya.
 *
 * Halaman ini memakai tiga hook data sekaligus:
 *   useTransaksi   - data utama yang ditampilkan pada tabel
 *   useNasabah     - mengisi pilihan nasabah pada form setoran
 *   useJenisSampah - mengisi pilihan jenis sampah pada form setoran
 */

import { useMemo, useState } from "react";
import Header from "../components/layouts/Header";
import SearchBar from "../components/shared/SearchBar";
import Pagination from "../components/shared/Pagination";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import ButtonTambahSetoran from "../components/transaksi/ButtonTambahSetoran";
import TransaksiTable from "../components/transaksi/TransaksiTable";
import TambahSetoranModal from "../components/transaksi/TambahSetoranModal";
import YearFilter from "../components/laporan/YearFilter";
import useTransaksi from "../hooks/useTransaksi";
import useNasabah from "../hooks/useNasabah";
import useJenisSampah from "../hooks/useJenisSampah";
import usePagination from "../hooks/usePagination";
import useDebounce from "../hooks/useDebounce";

export default function Transaksi() {
  const { data, loading, create, update, updateStatus, remove } = useTransaksi();
  const { data: nasabahList } = useNasabah();
  const { data: jenisSampahList } = useJenisSampah();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [year, setYear] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTransaksi, setEditingTransaksi] = useState(null);
  const [deletingTransaksi, setDeletingTransaksi] = useState(null);

  // Menyusun pilihan tahun dari tanggal transaksi yang ada, diurutkan dari
  // yang terbaru. Memakai Set agar tahun yang sama tidak muncul berulang.
  const availableYears = useMemo(() => {
    const years = new Set(
      data.map((item) => item.tanggal && Number(item.tanggal.slice(0, 4))).filter(Boolean)
    );
    return [...years].sort((a, b) => b - a);
  }, [data]);

  // Menyaring transaksi berdasarkan nama nasabah dan tahun.
  // Penyaringan tahun cukup memeriksa awalan tanggal, sebab tanggal tersimpan
  // dalam format YYYY-MM-DD.
  const filteredData = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return data.filter((item) => {
      const matchesSearch = (item.nama_nasabah || "").toLowerCase().includes(term);
      const matchesYear = !year || (item.tanggal || "").startsWith(String(year));
      return matchesSearch && matchesYear;
    });
  }, [data, debouncedSearch, year]);

  const { page, setPage, totalPages, pageItems } = usePagination(filteredData, 10);

  /** Mengubah status setoran langsung dari dropdown pada tabel. */
  const handleStatusChange = (transaksi, status) => updateStatus(transaksi.id, status);

  /** Membuka modal dalam mode pencatatan setoran baru. */
  const openNewSetoranModal = () => {
    setEditingTransaksi(null);
    setShowModal(true);
  };

  /** Membuka modal dalam mode ubah data setoran. */
  const openEditSetoranModal = (transaksi) => {
    setEditingTransaksi(transaksi);
    setShowModal(true);
  };

  /** Menutup modal sekaligus mengosongkan data yang sedang diubah. */
  const closeSetoranModal = () => {
    setShowModal(false);
    setEditingTransaksi(null);
  };

  // Satu modal dipakai untuk dua keperluan. Mode ditentukan dari ada atau
  // tidaknya data transaksi yang sedang diubah.
  const handleSubmit = (payload) =>
    editingTransaksi ? update(editingTransaksi.id, payload) : create(payload);

  /** Menjalankan penghapusan setelah pengguna menekan tombol konfirmasi. */
  const confirmDelete = async () => {
    if (!deletingTransaksi) return;
    await remove(deletingTransaksi.id);
    setDeletingTransaksi(null);
  };

  return (
    <>
      <Header title="Transaksi" subtitle="Seluruh setoran sampah dari semua nasabah." />

      <div className="admin-content-actions">
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", flex: 1 }}>
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari Nasabah..." />
          <YearFilter years={availableYears} value={year} onChange={setYear} includeAll allLabel="Semua Tahun" />
        </div>
        <ButtonTambahSetoran onClick={openNewSetoranModal} />
      </div>

      <TransaksiTable
        data={pageItems}
        loading={loading}
        onStatusChange={handleStatusChange}
        onEdit={openEditSetoranModal}
        onDelete={setDeletingTransaksi}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <TambahSetoranModal
        show={showModal}
        onClose={closeSetoranModal}
        onSubmit={handleSubmit}
        nasabahList={nasabahList}
        jenisSampahList={jenisSampahList}
        initialData={editingTransaksi}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingTransaksi)}
        onClose={() => setDeletingTransaksi(null)}
        onConfirm={confirmDelete}
        title="Hapus Setoran"
        message="Apakah Anda yakin ingin menghapus setoran ini?"
        confirmLabel="Hapus"
        danger
      />
    </>
  );
}
