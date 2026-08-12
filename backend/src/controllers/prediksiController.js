/**
 * Controller Prediksi
 *
 * Menjalankan prediksi volume sampah dengan metode Random Forest Regression.
 * Controller ini hanya memvalidasi parameter horizon; proses pemodelannya
 * sendiri dijalankan oleh skrip Python melalui prediksiService.
 */

const prediksiService = require("../services/prediksiService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { ok } = require("../utils/response");

/**
 * POST /api/prediksi
 *
 * Body: { horizon }
 *
 * Horizon adalah rentang waktu prediksi ke depan dan hanya boleh bernilai
 * 6 atau 12 bulan. Pembatasan ini disamakan dengan pilihan yang tersedia
 * di antarmuka agar hasil prediksi tetap dapat dipertanggungjawabkan.
 */
exports.runPrediksi = asyncHandler(async (req, res) => {
  const { horizon } = req.body || {};
  const parsedHorizon = Number(horizon);

  if (![6, 12].includes(parsedHorizon)) {
    throw new AppError("Horizon prediksi harus 6 atau 12 bulan", 400);
  }

  const data = await prediksiService.runPrediksi(parsedHorizon);
  return ok(res, data, "Prediksi berhasil dijalankan");
});
