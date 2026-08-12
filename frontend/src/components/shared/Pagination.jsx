/**
 * Komponen Navigasi Halaman
 *
 * Menampilkan tombol maju dan mundur beserta nomor halaman yang sedang dibuka.
 *
 * Perhitungan halaman tidak dilakukan di sini, melainkan oleh hook
 * usePagination. Komponen ini hanya menampilkan dan meneruskan permintaan
 * perpindahan halaman.
 *
 * @param {object} props
 * @param {number} props.page - Nomor halaman saat ini.
 * @param {number} props.totalPages - Jumlah seluruh halaman.
 * @param {Function} props.onPageChange - Dipanggil dengan nomor halaman tujuan.
 */

import "./Pagination.css";

export default function Pagination({ page, totalPages, onPageChange }) {
  // Navigasi disembunyikan bila datanya hanya cukup untuk satu halaman
  if (totalPages <= 1) return null;

  return (
    <div className="shared-pagination">
      <button
        type="button"
        className="shared-pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Halaman sebelumnya"
      >
        &lsaquo;
      </button>

      <span className="shared-pagination-current">{page}</span>

      <button
        type="button"
        className="shared-pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Halaman berikutnya"
      >
        &rsaquo;
      </button>
    </div>
  );
}
