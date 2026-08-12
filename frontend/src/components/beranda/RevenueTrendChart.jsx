import LineTrendChart from "../shared/LineTrendChart";
import { formatBulanTahun } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { COLORS } from "../../constants/colors";

/**
 * Grafik Tren Pendapatan Bulanan
 *
 * Menampilkan perkembangan pendapatan 12 bulan terakhir di halaman Beranda.
 *
 * Komponen ini bertugas menyiapkan data dan pilihan tampilannya, sedangkan
 * penggambaran grafiknya diserahkan ke LineTrendChart.
 *
 * @param {{data: Array<{bulan_num: number, tahun: number, pendapatan: number}>}} props
 */

export default function RevenueTrendChart({ data }) {
  // Ubah data menjadi bentuk yang dikenali grafik. Tanda (data || [])
  // menjaga agar komponen tetap aman saat datanya belum tersedia.
  const chartData = (data || []).map((row) => ({
    label: formatBulanTahun(row.bulan_num, row.tahun),
    pendapatan: row.pendapatan,
  }));

  return (
    <LineTrendChart
      data={chartData}
      xKey="label"
      lines={[{ dataKey: "pendapatan", name: "Pendapatan", color: COLORS.rupiah }]}
      valueFormatter={formatCurrency}
    />
  );
}
