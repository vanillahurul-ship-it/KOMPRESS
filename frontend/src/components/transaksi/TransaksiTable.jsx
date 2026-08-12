/**
 * Tabel Transaksi
 *
 * Menampilkan daftar setoran sampah beserta dropdown status dan tombol ubah
 * serta hapus pada setiap baris.
 *
 * Menangani tiga keadaan tampilan: sedang memuat, tidak ada data, dan
 * menampilkan data.
 *
 * @param {object} props
 * @param {Array<object>} props.data - Transaksi pada halaman yang sedang dibuka.
 * @param {boolean} props.loading - Menandakan data masih dimuat.
 * @param {Function} props.onStatusChange - Dipanggil dengan data transaksi dan status baru.
 * @param {Function} props.onEdit - Dipanggil dengan data transaksi yang diubah.
 * @param {Function} props.onDelete - Dipanggil dengan data transaksi yang dihapus.
 */

import TransaksiRow from "./TransaksiRow";
import EmptyState from "../shared/EmptyState";
import LoadingSkeleton from "../shared/LoadingSkeleton";
import "../shared/Table.css";

// Perbandingan lebar kolom, dipakai bersama oleh baris kepala dan baris isi
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
