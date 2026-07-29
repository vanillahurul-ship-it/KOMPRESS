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
