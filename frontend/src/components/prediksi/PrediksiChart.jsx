import LineTrendChart from "../shared/LineTrendChart";
import { formatBulanTahun } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { COLORS } from "../../constants/colors";

/**
 * Grafik Hasil Prediksi
 *
 * Menampilkan hasil prediksi pendapatan secara penuh di halaman Prediksi.
 *
 * Berbeda dengan cuplikannya di halaman Beranda, grafik ini dibuat lebih
 * tinggi dan garisnya utuh, karena di sini prediksi memang menjadi isi utama
 * halaman dan tidak perlu dibedakan dari data lain.
 *
 * @param {{predictions: Array<{bulan_num: number, tahun: number, prediksi_pendapatan: number}>}} props
 */

export default function PrediksiChart({ predictions }) {
  const chartData = predictions.map((row) => ({
    label: formatBulanTahun(row.bulan_num, row.tahun),
    prediksi: row.prediksi_pendapatan,
  }));

  return (
    <LineTrendChart
      data={chartData}
      xKey="label"
      lines={[{ dataKey: "prediksi", name: "Prediksi Pendapatan", color: COLORS.brand }]}
      valueFormatter={formatCurrency}
      height={300}
    />
  );
}
