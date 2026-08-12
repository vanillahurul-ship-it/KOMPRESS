import LineTrendChart from "../shared/LineTrendChart";
import { formatBulanTahun } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { COLORS } from "../../constants/colors";

/**
 * Grafik Ringkas Prediksi Pendapatan
 *
 * Menampilkan cuplikan hasil prediksi 6 bulan ke depan di halaman Beranda.
 *
 * Garisnya sengaja dibuat putus-putus untuk menegaskan bahwa angka tersebut
 * merupakan perkiraan, bukan data yang benar-benar terjadi. Tingginya juga
 * dibuat lebih pendek karena hanya berupa cuplikan; tampilan lengkapnya
 * tersedia di halaman Prediksi.
 *
 * @param {{predictions: Array<{bulan_num: number, tahun: number, prediksi_pendapatan: number}>}} props
 */

export default function PredictionMiniChart({ predictions }) {
  const chartData = (predictions || []).map((row) => ({
    label: formatBulanTahun(row.bulan_num, row.tahun),
    prediksi: row.prediksi_pendapatan,
  }));

  return (
    <LineTrendChart
      data={chartData}
      xKey="label"
      lines={[{ dataKey: "prediksi", name: "Prediksi Pendapatan", color: COLORS.brand, dashed: true }]}
      valueFormatter={formatCurrency}
      height={220}
    />
  );
}
