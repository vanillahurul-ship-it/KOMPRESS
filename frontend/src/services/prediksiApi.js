/**
 * API Prediksi
 *
 * Pemanggilan endpoint /api/prediksi di backend.
 */

import apiClient from "./apiClient";

/**
 * Menjalankan prediksi pendapatan.
 *
 * Memakai metode POST karena parameter horizon dikirim melalui body.
 * Proses ini memerlukan waktu lebih lama dibanding permintaan lain, sebab
 * backend menjalankan model Random Forest terlebih dahulu.
 *
 * @param {number} horizon - Rentang prediksi dalam bulan (6 atau 12).
 * @returns {Promise<object>} Hasil prediksi beserta metrik akurasi model.
 */
export const runPrediksi = (horizon) =>
  apiClient.post("/prediksi", { horizon }).then((res) => res.data.data);
