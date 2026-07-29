import "./Prediksi.css";

export default function PrediksiMetrics({ mae, rmse, r2 }) {
  // Backend hanya mengembalikan MAE, RMSE, dan R² — MSE diturunkan di sini sebagai
  // RMSE^2 (RMSE = akar dari MSE) tanpa perlu mengubah model/backend Python.
  const mse = rmse * rmse;

  return (
    <div className="prediksi-metrics-grid">
      <div className="prediksi-metric-tile">
        <p>MAE</p>
        <p>{mae.toLocaleString("id-ID")}</p>
      </div>
      <div className="prediksi-metric-tile">
        <p>MSE</p>
        <p>{mse.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
      </div>
      <div className="prediksi-metric-tile">
        <p>RMSE</p>
        <p>{rmse.toLocaleString("id-ID")}</p>
      </div>
      <div className="prediksi-metric-tile">
        <p>R&sup2; Score</p>
        <p>{r2.toFixed(4)}</p>
      </div>
    </div>
  );
}
