import { useState } from "react";
import Header from "../components/layouts/Header";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import JenisSampahForm from "../components/jenisSampah/JenisSampahForm";
import JenisSampahList from "../components/jenisSampah/JenisSampahList";
import useJenisSampah from "../hooks/useJenisSampah";
import usePagination from "../hooks/usePagination";

export default function JenisSampah() {
  const { data, loading, create, update, remove } = useJenisSampah();
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const { page, setPage, totalPages, pageItems } = usePagination(data, 6);

  const handleSubmit = async (payload) => {
    if (editingItem) {
      await update(editingItem.id, payload);
      setEditingItem(null);
    } else {
      await create(payload);
    }
  };

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
