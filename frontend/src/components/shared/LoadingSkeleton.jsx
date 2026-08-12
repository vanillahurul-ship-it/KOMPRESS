/**
 * Komponen Kerangka Pemuatan
 *
 * Menampilkan beberapa batang abu-abu sebagai pengganti sementara selagi data
 * dimuat. Cara ini dipilih karena bentuknya menyerupai tampilan akhir,
 * sehingga peralihan ke data sungguhan terasa lebih halus dibanding sekadar
 * tulisan "memuat".
 *
 * @param {{rows?: number}} props - Jumlah baris kerangka, bawaannya 5.
 */

import "./LoadingSkeleton.css";

export default function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="shared-skeleton-list" aria-label="Memuat data">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="shared-skeleton-row" />
      ))}
    </div>
  );
}
