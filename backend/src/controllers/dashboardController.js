/**
 * Controller Dashboard
 *
 * Menyediakan data ringkasan untuk halaman beranda admin. Seluruh
 * perhitungan dikerjakan di dashboardService, sehingga controller ini hanya
 * meneruskan hasilnya ke frontend.
 */

const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response");

/**
 * GET /api/dashboard
 *
 * Mengembalikan ringkasan statistik dan data grafik untuk halaman beranda.
 */
exports.getDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardSummary();
  return ok(res, data);
});
