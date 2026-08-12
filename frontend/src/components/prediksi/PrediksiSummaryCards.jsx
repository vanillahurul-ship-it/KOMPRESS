/**
 * Kartu Ringkasan Prediksi
 *
 * Menampilkan total prediksi pendapatan dan rata-ratanya per bulan.
 *
 * Memakai kembali komponen StatCard dari halaman Beranda, agar tampilan angka
 * ringkasan di seluruh aplikasi tetap seragam.
 *
 * @param {object} props
 * @param {object} props.result - Hasil prediksi dari backend.
 * @param {number} props.horizon - Rentang prediksi dalam bulan.
 */

import StatCard from "../beranda/StatCard";
import { formatCurrency } from "../../utils/formatCurrency";

export default function PrediksiSummaryCards({ result, horizon }) {
  return (
    <div className="stat-card-grid">
      <StatCard
        value={formatCurrency(result.total_prediksi)}
        label={`Total Prediksi (${horizon} bulan kedepan)`}
      />
      <StatCard
        value={formatCurrency(result.rata_rata_pendapatan)}
        label="Rata-rata Pendapatan / bulan"
      />
    </div>
  );
}
