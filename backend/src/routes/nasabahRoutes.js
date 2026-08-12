/**
 * Route Nasabah
 *
 * Dipasang di app.js pada prefiks /api/nasabah dan wajib menyertakan token.
 *
 * Mengelola data nasabah bank sampah, mulai dari pendaftaran, perubahan data,
 * hingga penghapusan.
 *
 * Daftar endpoint:
 *   GET    /api/nasabah      - Mengambil daftar nasabah
 *   POST   /api/nasabah      - Mendaftarkan nasabah baru
 *   PUT    /api/nasabah/:id  - Memperbarui data nasabah tertentu
 *   DELETE /api/nasabah/:id  - Menghapus nasabah tertentu
 */

const express = require("express");
const router = express.Router();

const nasabahController = require("../controllers/nasabahController");

router.get("/", nasabahController.getAllNasabah);
router.post("/", nasabahController.createNasabah);
router.put("/:id", nasabahController.updateNasabah);
router.delete("/:id", nasabahController.deleteNasabah);

module.exports = router;
