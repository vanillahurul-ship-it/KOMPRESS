/**
 * Kartu Statistik
 *
 * Menampilkan satu angka penting beserta keterangannya pada halaman Beranda.
 *
 * Ikon dan nilai perubahan bersifat opsional, sehingga komponen ini dapat
 * dipakai untuk angka sederhana seperti jumlah nasabah maupun untuk angka yang
 * disertai perbandingan seperti pendapatan bulan ini.
 *
 * @param {object} props
 * @param {string} [props.icon] - Alamat berkas ikon.
 * @param {string|number} props.value - Angka utama yang ditampilkan.
 * @param {string} props.label - Keterangan angka tersebut.
 * @param {number} [props.delta] - Persentase perubahan dibanding bulan lalu.
 *        Nilai positif ditampilkan hijau, negatif merah.
 */

import "./StatCard.css";

export default function StatCard({ icon, value, label, delta }) {
  return (
    <div className="stat-card">
      {icon && (
        <div className="stat-card-icon">
          <img src={icon} alt="" />
        </div>
      )}
      <p className="stat-card-value">{value}</p>
      <p className="stat-card-label">{label}</p>
      {/* Diperiksa terhadap undefined dan null secara khusus, sebab perubahan
          sebesar 0 persen tetap merupakan nilai yang perlu ditampilkan */}
      {delta !== undefined && delta !== null && (
        <p className={`stat-card-delta ${delta >= 0 ? "positive" : "negative"}`}>
          {delta >= 0 ? "+" : ""}
          {delta}% dari bulan lalu
        </p>
      )}
    </div>
  );
}
