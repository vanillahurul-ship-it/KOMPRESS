/**
 * Route Laporan
 *
 * Dipasang di app.js pada prefiks /api/laporan dan wajib menyertakan token.
 *
 * Menyediakan rekapitulasi transaksi per periode yang dipakai halaman Laporan,
 * termasuk sebagai sumber data saat laporan diunduh ke Excel atau PDF.
 *
 * Daftar endpoint:
 *   GET /api/laporan - Mengambil rekap laporan (dapat disaring per tahun)
 */

const express = require("express");
const router = express.Router();

const laporanController = require("../controllers/laporanController");

router.get("/", laporanController.getLaporan);

module.exports = router;
