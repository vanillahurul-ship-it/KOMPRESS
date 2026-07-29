const laporanService = require("../services/laporanService");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response");

exports.getLaporan = asyncHandler(async (req, res) => {
  const { tahun } = req.query;
  const data = await laporanService.getLaporan(tahun);
  return ok(res, data);
});
