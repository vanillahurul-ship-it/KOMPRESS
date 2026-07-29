import LineTrendChart from "../shared/LineTrendChart";
import { formatBulanTahun } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { COLORS } from "../../constants/colors";

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
