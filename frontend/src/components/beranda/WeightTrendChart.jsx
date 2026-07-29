import LineTrendChart from "../shared/LineTrendChart";
import { formatBulanTahun } from "../../utils/formatDate";
import { COLORS } from "../../constants/colors";

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
