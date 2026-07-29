import { useState } from "react";
import Header from "../components/layouts/Header";
import PrediksiConfigCard from "../components/prediksi/PrediksiConfigCard";
import PrediksiInfoRandomForest from "../components/prediksi/PrediksiInfoRandomForest";
import PrediksiSummaryCards from "../components/prediksi/PrediksiSummaryCards";
import PrediksiMetrics from "../components/prediksi/PrediksiMetrics";
import PrediksiMetricsInfo from "../components/prediksi/PrediksiMetricsInfo";
import PrediksiChart from "../components/prediksi/PrediksiChart";
import InfoTooltip from "../components/shared/InfoTooltip";
import usePrediksi from "../hooks/usePrediksi";
import { formatCurrency } from "../utils/formatCurrency";
import { formatBulanTahun } from "../utils/formatDate";
import "../components/shared/Card.css";
import "../components/prediksi/Prediksi.css";

export default function Prediksi() {
  const [horizon, setHorizon] = useState(6);
  const { result, loading, run } = usePrediksi();

  return (
    <>
      <Header title="Prediksi Pendapatan" subtitle="Prediksi berbasis algoritma Random Forest Regression" />

      <PrediksiInfoRandomForest />

      <PrediksiConfigCard
        horizon={horizon}
        onHorizonChange={setHorizon}
        onRun={() => run(horizon)}
        loading={loading}
      />

      {result && (
        <>
          <PrediksiSummaryCards result={result} horizon={horizon} />

          {result.warning && (
            <p style={{ color: "#8A6D1D", fontSize: 13, margin: 0 }}>{result.warning}</p>
          )}

          <div className="shared-card">
            <h2 className="shared-card-title">
              Grafik Prediksi Pendapatan
              <InfoTooltip
                text={
                  "Garis pada grafik ini menunjukkan hasil prediksi pendapatan dari algoritma Random Forest Regression untuk beberapa bulan ke depan.\n\n" +
                  "Seberapa dekat prediksi ini dengan pendapatan yang nantinya benar-benar terjadi dapat dilihat dari nilai MAE, RMSE, dan R² pada bagian Evaluasi Model di bawah — semakin kecil MAE/RMSE dan semakin dekat R² ke angka 1, semakin akurat model ini."
                }
              />
            </h2>
            <p className="shared-card-subtitle">Prediksi pendapatan selama {horizon} bulan</p>
            <PrediksiChart predictions={result.predictions} />
          </div>

          <div className="shared-card">
            <h2 className="shared-card-title">Evaluasi Model</h2>
            <p className="shared-card-subtitle">Mean Absolute Error, Mean Squared Error, Root Mean Squared Error, R&sup2; Score</p>
            <PrediksiMetrics mae={result.mae} rmse={result.rmse} r2={result.r2} />
            <PrediksiMetricsInfo />
          </div>

          <div className="shared-card">
            <h2 className="shared-card-title">Tabel Prediksi</h2>
            <div className="prediksi-table-wrapper">
              <table className="prediksi-table">
                <thead>
                  <tr>
                    <th>Bulan</th>
                    <th>Prediksi Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {result.predictions.map((row) => (
                    <tr key={`${row.tahun}-${row.bulan_num}`}>
                      <td>{formatBulanTahun(row.bulan_num, row.tahun)}</td>
                      <td>{formatCurrency(row.prediksi_pendapatan)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
