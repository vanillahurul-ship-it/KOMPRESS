/**
 * Tabel Data Nasabah
 *
 * Menampilkan daftar nasabah beserta tombol ubah dan hapus pada setiap baris.
 *
 * Komponen ini menangani tiga keadaan tampilan: sedang memuat, tidak ada data,
 * dan menampilkan data.
 *
 * @param {object} props
 * @param {Array<object>} props.data - Nasabah pada halaman yang sedang dibuka.
 * @param {boolean} props.loading - Menandakan data masih dimuat.
 * @param {Function} props.onEdit - Dipanggil dengan data nasabah yang diubah.
 * @param {Function} props.onDelete - Dipanggil dengan data nasabah yang dihapus.
 */

import NasabahRow from "./NasabahRow";
import EmptyState from "../shared/EmptyState";
import LoadingSkeleton from "../shared/LoadingSkeleton";
import "../shared/Table.css";

// Perbandingan lebar kolom tabel. Nilai ini dipakai bersama oleh baris kepala
// dan baris isi, agar keduanya selalu sejajar walau lebar layar berubah.
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
