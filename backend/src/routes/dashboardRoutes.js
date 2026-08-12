/**
 * Route Dashboard
 *
 * Dipasang di app.js pada prefiks /api/dashboard dan wajib menyertakan token.
 *
 * Menyediakan data ringkasan untuk halaman beranda admin, seperti jumlah
 * nasabah, total berat sampah, dan pemasukan.
 *
 * Daftar endpoint:
 *   GET /api/dashboard - Mengambil seluruh data ringkasan beranda
 */

const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

router.get("/", dashboardController.getDashboard);

module.exports = router;
