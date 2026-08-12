/**
 * Konfigurasi Aplikasi Express
 *
 * File ini merakit seluruh bagian aplikasi menjadi satu instance Express:
 * middleware global (CORS & parser JSON), pendaftaran seluruh route API,
 * dan penanganan error terpusat.
 *
 * Urutan pemasangan di bawah ini penting dan tidak boleh diubah sembarangan:
 *   1. Middleware global (CORS, express.json)
 *   2. Route publik (/api/auth) yang tidak memerlukan token
 *   3. authMiddleware sebagai penjaga seluruh route /api lainnya
 *   4. Route yang membutuhkan login
 *   5. errorHandler yang selalu dipasang paling akhir
 *
 * Server-nya sendiri dijalankan di server.js, bukan di file ini, supaya
 * aplikasi mudah diuji tanpa harus membuka port.
 */

const express = require("express");
const cors = require("cors");

// Kumpulan route per modul fitur
const authRoutes = require("./routes/authRoutes");
const nasabahRoutes = require("./routes/nasabahRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");
const jenisSampahRoutes = require("./routes/jenisSampahRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const laporanRoutes = require("./routes/laporanRoutes");
const prediksiRoutes = require("./routes/prediksiRoutes");
const profilRoutes = require("./routes/profilRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// --- Middleware global ---------------------------------------------------

// FRONTEND_URL boleh berisi lebih dari satu origin yang dipisah koma,
// misalnya untuk alamat pengembangan (localhost) dan alamat produksi sekaligus.
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Mengizinkan Express membaca body request ber-format JSON
app.use(express.json());

// --- Route ---------------------------------------------------------------

// Endpoint pemeriksaan kesehatan server (health check)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Bank Sampah Macodes berhasil berjalan 🚀",
  });
});

// Route publik: login dan registrasi belum memiliki token
app.use("/api/auth", authRoutes);

// Penjaga akses: seluruh route yang didaftarkan setelah baris ini
// wajib menyertakan token Supabase yang masih berlaku.
app.use("/api", authMiddleware);

// Route yang hanya bisa diakses admin yang sudah masuk
app.use("/api/nasabah", nasabahRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/jenis-sampah", jenisSampahRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/prediksi", prediksiRoutes);
app.use("/api/profil", profilRoutes);

// Penanganan error terpusat, wajib dipasang paling akhir
app.use(errorHandler);

module.exports = app;
