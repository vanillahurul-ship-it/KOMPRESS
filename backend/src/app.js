const express = require("express");
const cors = require("cors");

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

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Route utama
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Bank Sampah Macodes berhasil berjalan 🚀",
  });
});

// Public routes
app.use("/api/auth", authRoutes);

// Everything below requires a valid Supabase access token
app.use("/api", authMiddleware);

app.use("/api/nasabah", nasabahRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/jenis-sampah", jenisSampahRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/prediksi", prediksiRoutes);
app.use("/api/profil", profilRoutes);

app.use(errorHandler);

module.exports = app;
