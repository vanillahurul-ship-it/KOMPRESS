/**
 * Route Otentikasi
 *
 * Dipasang di app.js pada prefiks /api/auth.
 *
 * Route ini bersifat publik karena didaftarkan SEBELUM authMiddleware.
 * Pengguna memang belum memiliki token saat hendak masuk, sehingga endpoint
 * di sini tidak boleh dijaga token.
 *
 * Daftar endpoint:
 *   POST /api/auth/login - Masuk memakai email dan kata sandi
 */

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/login", authController.login);

module.exports = router;
