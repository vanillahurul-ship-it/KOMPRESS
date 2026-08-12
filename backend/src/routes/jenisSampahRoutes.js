/**
 * Route Jenis Sampah
 *
 * Dipasang di app.js pada prefiks /api/jenis-sampah dan wajib menyertakan token.
 *
 * Mengelola daftar harga sampah, yaitu jenis sampah beserta harga belinya
 * per kilogram. Data ini menjadi acuan perhitungan pada modul transaksi.
 *
 * Daftar endpoint:
 *   GET    /api/jenis-sampah      - Mengambil seluruh jenis sampah
 *   POST   /api/jenis-sampah      - Menambah jenis sampah baru
 *   PUT    /api/jenis-sampah/:id  - Memperbarui jenis sampah tertentu
 *   DELETE /api/jenis-sampah/:id  - Menghapus jenis sampah tertentu
 */

const express = require("express");
const router = express.Router();

const jenisSampahController = require("../controllers/jenisSampahController");

router.get("/", jenisSampahController.getAllJenisSampah);
router.post("/", jenisSampahController.createJenisSampah);
router.put("/:id", jenisSampahController.updateJenisSampah);
router.delete("/:id", jenisSampahController.deleteJenisSampah);

module.exports = router;
