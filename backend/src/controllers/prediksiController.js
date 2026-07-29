const prediksiService = require("../services/prediksiService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { ok } = require("../utils/response");

exports.runPrediksi = asyncHandler(async (req, res) => {
  const { horizon } = req.body || {};
  const parsedHorizon = Number(horizon);

  if (![6, 12].includes(parsedHorizon)) {
    throw new AppError("Horizon prediksi harus 6 atau 12 bulan", 400);
  }

  const data = await prediksiService.runPrediksi(parsedHorizon);
  return ok(res, data, "Prediksi berhasil dijalankan");
});
