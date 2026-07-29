import NasabahRow from "./NasabahRow";
import EmptyState from "../shared/EmptyState";
import LoadingSkeleton from "../shared/LoadingSkeleton";
import "../shared/Table.css";

const COLUMNS = "1.3fr 1.6fr 1fr 1.1fr 0.9fr 0.9fr";

export default function NasabahTable({ data, loading, onEdit, onDelete }) {
  return (
    <section className="shared-table-card">
      <div className="shared-table-grid shared-table-header-row" style={{ "--table-columns": COLUMNS }}>
        <span>NASABAH</span>
        <span>ALAMAT</span>
        <span>NO REKENING</span>
        <span>SALDO</span>
        <span>STATUS</span>
        <span>AKSI</span>
      </div>

      <div className="shared-table-body">
        {loading ? (
          <LoadingSkeleton />
        ) : data.length === 0 ? (
          <EmptyState title="Belum ada data nasabah" description="Tambahkan nasabah baru untuk memulai." />
        ) : (
          data.map((item) => (
            <NasabahRow
              key={item.id}
              data={item}
              onEdit={onEdit}
              onDelete={onDelete}
              style={{ "--table-columns": COLUMNS }}
            />
          ))
        )}
      </div>
    </section>
  );
}
