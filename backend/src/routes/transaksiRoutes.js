/**
 * Route Transaksi
 *
 * Dipasang di app.js pada prefiks /api/transaksi dan wajib menyertakan token.
 *
 * Mengelola transaksi setoran sampah dari nasabah, mulai dari pencatatan
 * setoran, perubahan data, perubahan status, hingga penghapusan.
 *
 * Endpoint status dipisahkan memakai PATCH karena hanya mengubah satu kolom
 * saja, sedangkan PUT dipakai untuk memperbarui keseluruhan data transaksi.
 *
 * Daftar endpoint:
 *   GET    /api/transaksi             - Mengambil daftar transaksi
 *   POST   /api/transaksi             - Mencatat setoran baru
 *   PUT    /api/transaksi/:id         - Memperbarui data transaksi tertentu
 *   PATCH  /api/transaksi/:id/status  - Mengubah status transaksi saja
 *   DELETE /api/transaksi/:id         - Menghapus transaksi tertentu
 */

const express = require("express");
const router = express.Router();

const transaksiController = require("../controllers/transaksiController");

router.get("/", transaksiController.getAllTransaksi);
router.post("/", transaksiController.createTransaksi);
router.put("/:id", transaksiController.updateTransaksi);
router.patch("/:id/status", transaksiController.updateStatus);
router.delete("/:id", transaksiController.deleteTransaksi);

module.exports = router;
