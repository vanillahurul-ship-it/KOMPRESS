import "./Prediksi.css";

const METRICS = [
  {
    label: "MAE (Mean Absolute Error)",
    points: [
      "Menunjukkan rata-rata selisih antara nilai prediksi dan nilai sebenarnya.",
      "Semakin kecil nilainya, semakin baik model memprediksi pendapatan.",
    ],
  },
  {
    label: "MSE (Mean Squared Error)",
    points: [
      "Mengukur rata-rata kuadrat dari kesalahan prediksi.",
      "Memberikan penalti lebih besar terhadap kesalahan yang besar dibanding MAE.",
    ],
  },
  {
    label: "RMSE (Root Mean Squared Error)",
    points: [
      "Merupakan akar dari MSE, sehingga satuannya sama dengan data pendapatan (Rupiah).",
      "Semakin kecil nilainya, semakin baik dan akurat model.",
    ],
  },
  {
    label: "R² Score",
    points: [
      "Menunjukkan seberapa baik model menjelaskan variasi data pendapatan.",
      "Nilai yang mendekati 1 berarti model semakin baik dalam menjelaskan pola data.",
    ],
  },
];

// Penjelasan hasil evaluasi model Random Forest, ditampilkan di bawah tile metrik
// pada halaman Prediksi supaya admin non-teknis memahami arti setiap angka.
export default function PrediksiMetricsInfo() {
  return (
    <div className="prediksi-metrics-info-grid">
      {METRICS.map((metric) => (
        <div key={metric.label} className="prediksi-metrics-info-card">
          <h3>{metric.label}</h3>
          <ul>
            {metric.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      ))}

      <p className="prediksi-metrics-info-note">
        Keempat metrik ini penting dalam penelitian prediksi pendapatan menggunakan Random Forest Regression karena
        menunjukkan seberapa jauh hasil prediksi model menyimpang dari data pendapatan sebenarnya — semakin kecil
        nilai kesalahan (MAE, MSE, RMSE) dan semakin tinggi R², semakin dapat diandalkan model untuk memprediksi
        pendapatan Bank Sampah di masa depan.
      </p>
    </div>
  );
}
