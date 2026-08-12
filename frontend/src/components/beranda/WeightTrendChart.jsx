import LineTrendChart from "../shared/LineTrendChart";
import { formatBulanTahun } from "../../utils/formatDate";
import { COLORS } from "../../constants/colors";

/**
 * Grafik Tren Berat Sampah Bulanan
 *
 * Menampilkan perkembangan berat sampah yang terkumpul selama 12 bulan
 * terakhir di halaman Beranda.
 *
 * Berbeda dengan grafik pendapatan, nilai di sini tidak diubah ke format
 * rupiah karena satuannya kilogram.
 *
 * @param {{data: Array<{bulan_num: number, tahun: number, berat: number}>}} props
 */

export default function WeightTrendChart({ data }) {
  const chartData = (data || []).map((row) => ({
    label: formatBulanTahun(row.bulan_num, row.tahun),
    berat: row.berat,
  }));

  return (
    <LineTrendChart
      data={chartData}
      xKey="label"
      lines={[{ dataKey: "berat", name: "Berat (Kg)", color: COLORS.primary }]}
    />
  );
}
