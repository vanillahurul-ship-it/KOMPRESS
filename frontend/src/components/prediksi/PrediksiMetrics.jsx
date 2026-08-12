/**
 * Kotak Nilai Evaluasi Model
 *
 * Menampilkan empat nilai evaluasi model prediksi: MAE, MSE, RMSE, dan R².
 * Penjelasan arti masing-masing nilai ditampilkan komponen PrediksiMetricsInfo
 * tepat di bawahnya.
 *
 * @param {object} props
 * @param {number} props.mae - Mean Absolute Error.
 * @param {number} props.rmse - Root Mean Squared Error.
 * @param {number} props.r2 - Koefisien determinasi (R² Score).
 */

import "./Prediksi.css";

export default function PrediksiMetrics({ mae, rmse, r2 }) {
  // Backend hanya mengirim MAE, RMSE, dan R². Nilai MSE diperoleh dengan
  // mengkuadratkan RMSE, sebab RMSE memang merupakan akar dari MSE. Dengan
  // begitu nilai MSE dapat ditampilkan tanpa perlu mengubah skrip Python.
  const mse = rmse * rmse;

  return (
    <div className="prediksi-metrics-grid">
      <div className="prediksi-metric-tile">
        <p>MAE</p>
        <p>{mae.toLocaleString("id-ID")}</p>
      </div>
      <div className="prediksi-metric-tile">
        <p>MSE</p>
        {/* Angka desimal MSE dibuang karena nilainya sangat besar,
            hasil dari pengkuadratan */}
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
