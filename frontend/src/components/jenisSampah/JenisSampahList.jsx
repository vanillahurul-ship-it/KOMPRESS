import JenisSampahRow from "./JenisSampahRow";
import EmptyState from "../shared/EmptyState";
import LoadingSkeleton from "../shared/LoadingSkeleton";
import Pagination from "../shared/Pagination";
import "../shared/Card.css";
import "./JenisSampahList.css";

export default function JenisSampahList({ data, loading, page, totalPages, onPageChange, onEdit, onDelete }) {
  return (
    <section className="shared-card" style={{ padding: "24px 0" }}>
      <h2 className="shared-card-title" style={{ padding: "0 28px" }}>Daftar Jenis Sampah</h2>

      <div style={{ marginTop: 12 }}>
        {loading ? (
          <LoadingSkeleton />
        ) : data.length === 0 ? (
          <EmptyState title="Belum ada jenis sampah" description="Tambahkan jenis sampah baru di formulir sebelah kiri." />
        ) : (
          data.map((item) => (
            <JenisSampahRow key={item.id} data={item} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </section>
  );
}
