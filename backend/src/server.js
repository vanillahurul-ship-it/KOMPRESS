/**
 * Titik Masuk Server
 *
 * Memuat variabel lingkungan dari berkas .env, lalu menjalankan aplikasi
 * Express yang sudah dirakit di app.js pada port yang ditentukan.
 *
 * Pemisahan antara app.js dan server.js dibuat supaya konfigurasi aplikasi
 * dapat diuji tanpa perlu benar-benar membuka koneksi jaringan.
 */

require("dotenv").config();

const app = require("./app");

// Gunakan port dari .env bila tersedia, jika tidak pakai 5000 sebagai bawaan
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
