/**
 * Penjelasan Algoritma Random Forest
 *
 * Menerangkan secara singkat cara kerja algoritma yang dipakai di halaman
 * Prediksi. Bahasanya sengaja disusun untuk admin bank sampah, bukan sebagai
 * dokumentasi teknis, sesuai kebutuhan panduan pengguna.
 */

import "../shared/Card.css";
import "../panduan/Panduan.css";

export default function PrediksiInfoRandomForest() {
  return (
    <section className="shared-card">
      <h2 className="shared-card-title">Apa itu Random Forest Regression?</h2>
      <p className="shared-card-subtitle">Algoritma di balik prediksi pendapatan pada halaman ini</p>

      <ul className="panduan-step-list" style={{ marginBottom: 0 }}>
        <li>Random Forest Regression adalah salah satu algoritma Machine Learning.</li>
        <li>Algoritma ini bekerja dengan membangun banyak Decision Tree (pohon keputusan) sekaligus.</li>
        <li>Hasil prediksi akhir diperoleh dari rata-rata hasil seluruh pohon keputusan tersebut.</li>
        <li>Pendekatan ini cocok digunakan untuk memprediksi pendapatan berdasarkan data historis transaksi Bank Sampah.</li>
      </ul>
    </section>
  );
}
