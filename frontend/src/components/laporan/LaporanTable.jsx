/**
 * Tabel Laporan
 *
 * Menampilkan rekap pendapatan per bulan beserta baris totalnya di bagian
 * paling bawah.
 *
 * Berkas gaya yang dipakai diambil dari folder prediksi, karena kedua tabel
 * ini memakai tampilan yang sama persis.
 *
 * @param {{laporan: object}} props - Data laporan dari backend.
 */

import EmptyState from "../shared/EmptyState";
import { formatCurrency, formatNumber } from "../../utils/formatCurrency";
import "../prediksi/Prediksi.css";

export default function LaporanTable({ laporan }) {
  // Tahun yang dipilih bisa saja belum memiliki transaksi sama sekali
  if (!laporan.rows.length) {
    return <EmptyState title="Belum ada data" description={`Tidak ada transaksi selesai pada tahun ${laporan.tahun}.`} />;
  }

  return (
    <div className="prediksi-table-wrapper">
      <table className="prediksi-table">
        <thead>
          <tr>
            <th>Bulan</th>
            <th>Jumlah Transaksi</th>
            <th>Total Berat</th>
            <th>Pendapatan</th>
          </tr>
        </thead>
        <tbody>
          {laporan.rows.map((row) => (
            <tr key={row.bulan_num}>
              <td>{row.bulan}</td>
              <td>{row.jumlah_transaksi}</td>
              <td>{formatNumber(row.total_berat)} Kg</td>
              <td>{formatCurrency(row.pendapatan)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ fontWeight: 700 }}>TOTAL PENDAPATAN</td>
            <td style={{ fontWeight: 700 }}>{laporan.total_transaksi}</td>
            <td style={{ fontWeight: 700 }}>{formatNumber(laporan.total_berat)} Kg</td>
            <td style={{ fontWeight: 700, color: "var(--admin-rupiah, #5A8841)" }}>
              {formatCurrency(laporan.total_pendapatan)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
