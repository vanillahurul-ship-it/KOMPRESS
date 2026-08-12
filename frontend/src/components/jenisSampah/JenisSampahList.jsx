/**
 * Daftar Jenis Sampah
 *
 * Menampilkan jenis sampah beserta harganya dalam bentuk daftar kartu, bukan
 * tabel, karena setiap barisnya hanya memuat sedikit informasi.
 *
 * Navigasi halaman diletakkan di dalam kartu ini, tidak seperti halaman lain
 * yang menaruhnya di bawah tabel, agar tetap berdampingan rapi dengan form di
 * sebelah kiri.
 *
 * @param {object} props
 * @param {Array<object>} props.data - Jenis sampah pada halaman yang dibuka.
 * @param {boolean} props.loading - Menandakan data masih dimuat.
 * @param {number} props.page - Nomor halaman saat ini.
 * @param {number} props.totalPages - Jumlah seluruh halaman.
 * @param {Function} props.onPageChange - Berpindah halaman.
 * @param {Function} props.onEdit - Dipanggil dengan data yang ingin diubah.
 * @param {Function} props.onDelete - Dipanggil dengan data yang ingin dihapus.
 */

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
