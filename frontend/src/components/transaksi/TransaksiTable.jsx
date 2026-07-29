import TransaksiRow from "./TransaksiRow";
import EmptyState from "../shared/EmptyState";
import LoadingSkeleton from "../shared/LoadingSkeleton";
import "../shared/Table.css";

const COLUMNS = "1.2fr 1fr 1.1fr 0.9fr 1fr 1.1fr 0.9fr";

export default function TransaksiTable({ data, loading, onStatusChange, onEdit, onDelete }) {
  return (
    <section className="shared-table-card">
      <div className="shared-table-grid shared-table-header-row" style={{ "--table-columns": COLUMNS }}>
        <span>NASABAH</span>
        <span>TANGGAL</span>
        <span>KATEGORI</span>
        <span>BERAT TOTAL</span>
        <span>TOTAL</span>
        <span>STATUS</span>
        <span>AKSI</span>
      </div>

      <div className="shared-table-body">
        {loading ? (
          <LoadingSkeleton />
        ) : data.length === 0 ? (
          <EmptyState title="Belum ada transaksi" description="Tambahkan setoran baru untuk memulai." />
        ) : (
          data.map((item) => (
            <TransaksiRow
              key={item.id}
              data={item}
              onStatusChange={onStatusChange}
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
