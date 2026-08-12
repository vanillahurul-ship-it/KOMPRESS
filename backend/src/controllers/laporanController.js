/**
 * Controller Laporan
 *
 * Menyediakan data rekap transaksi untuk halaman Laporan. Data yang sama
 * juga dipakai frontend saat laporan diunduh ke berkas Excel maupun PDF.
 */

const laporanService = require("../services/laporanService");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response");

/**
 * GET /api/laporan?tahun=2026
 *
 * Query:
 *   tahun (opsional) - Menyaring laporan pada tahun tertentu.
 *                      Bila tidak diisi, seluruh data dikembalikan.
 */
exports.getLaporan = asyncHandler(async (req, res) => {
  const { tahun } = req.query;
  const data = await laporanService.getLaporan(tahun);
  return ok(res, data);
});
