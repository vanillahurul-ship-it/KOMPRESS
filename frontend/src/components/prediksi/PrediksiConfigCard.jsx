import "../shared/Card.css";
import "./Prediksi.css";
import trendIcon from "../../assets/icons/prediksi/prediksi.svg";

export default function PrediksiConfigCard({ horizon, onHorizonChange, onRun, loading }) {
  return (
    <section className="shared-card">
      <h2 className="shared-card-title">Konfigurasi Prediksi</h2>
      <p className="shared-card-subtitle">Prediksi pendapatan berbasis algoritma Random Forest Regression</p>

      <div className="prediksi-config-row">
        <div className="prediksi-horizon-toggle">
          <button
            type="button"
            className={horizon === 6 ? "active" : ""}
            onClick={() => onHorizonChange(6)}
          >
            6 Bulan
          </button>
          <button
            type="button"
            className={horizon === 12 ? "active" : ""}
            onClick={() => onHorizonChange(12)}
          >
            12 Bulan
          </button>
        </div>

        <button type="button" className="shared-button-primary prediksi-run-button" onClick={onRun} disabled={loading}>
          <img src={trendIcon} alt="" />
          <span>{loading ? "Memproses..." : "Jalankan Prediksi"}</span>
        </button>
      </div>
    </section>
  );
}
