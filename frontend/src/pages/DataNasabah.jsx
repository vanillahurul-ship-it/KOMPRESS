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
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNasabah, setEditingNasabah] = useState(null);
  const [deletingNasabah, setDeletingNasabah] = useState(null);

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

  const openNewNasabahModal = () => {
    setEditingNasabah(null);
    setShowModal(true);
  };

  const openEditNasabahModal = (nasabah) => {
    setEditingNasabah(nasabah);
    setShowModal(true);
  };

  const closeNasabahModal = () => {
    setShowModal(false);
    setEditingNasabah(null);
  };

  const handleSubmit = (payload) =>
    editingNasabah ? update(editingNasabah.id, payload) : create(payload);

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
