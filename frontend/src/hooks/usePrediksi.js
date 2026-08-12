/**
 * Hook usePrediksi
 *
 * Menjalankan prediksi pendapatan dan menyimpan hasilnya.
 *
 * Berbeda dengan hook data lainnya, prediksi tidak dijalankan otomatis saat
 * halaman dibuka. Prosesnya cukup berat karena backend perlu melatih model
 * terlebih dahulu, sehingga baru dijalankan ketika pengguna menekan tombol.
 * Karena itu pula nilai awal loading di sini adalah false.
 */

import { useState } from "react";
import toast from "react-hot-toast";
import * as prediksiApi from "../services/prediksiApi";

/**
 * @returns {{result: object|null, loading: boolean, run: Function}}
 */
export default function usePrediksi() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Menjalankan prediksi sesuai rentang waktu yang dipilih pengguna.
   *
   * Hasilnya selain disimpan juga dikembalikan, agar komponen pemanggil dapat
   * langsung memakainya tanpa menunggu render berikutnya.
   *
   * @param {number} horizon - Rentang prediksi dalam bulan (6 atau 12).
   * @returns {Promise<object>} Hasil prediksi.
   */
  const run = async (horizon) => {
    setLoading(true);
    try {
      const data = await prediksiApi.runPrediksi(horizon);
      setResult(data);
      toast.success("Prediksi berhasil dijalankan");
      return data;
    } catch (error) {
      toast.error(error.message || "Gagal menjalankan prediksi");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, run };
}
