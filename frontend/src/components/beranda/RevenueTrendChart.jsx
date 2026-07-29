import LineTrendChart from "../shared/LineTrendChart";
import { formatBulanTahun } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { COLORS } from "../../constants/colors";

export default function RevenueTrendChart({ data }) {
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
