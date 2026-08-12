/**
 * Route Prediksi
 *
 * Dipasang di app.js pada prefiks /api/prediksi dan wajib menyertakan token.
 *
 * Menjalankan prediksi volume sampah menggunakan model Random Forest.
 * Endpoint ini memakai metode POST, bukan GET, karena frontend perlu
 * mengirimkan parameter prediksi (misalnya jumlah periode) pada body request.
 *
 * Daftar endpoint:
 *   POST /api/prediksi - Menjalankan proses prediksi dan mengembalikan hasilnya
 */

const express = require("express");
const router = express.Router();

const prediksiController = require("../controllers/prediksiController");

router.post("/", prediksiController.runPrediksi);

module.exports = router;
