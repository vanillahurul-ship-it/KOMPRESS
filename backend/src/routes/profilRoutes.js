/**
 * Route Profil
 *
 * Dipasang di app.js pada prefiks /api/profil dan wajib menyertakan token.
 *
 * Mengelola profil bank sampah (nama, alamat, logo) sekaligus pengelolaan
 * akun admin, seperti melihat daftar admin, mengganti nama, dan menyetel
 * ulang kata sandi.
 *
 * Route ini satu-satunya yang menerima unggahan berkas, yaitu logo bank
 * sampah, sehingga memerlukan middleware multer.
 *
 * Daftar endpoint:
 *   GET    /api/profil                     - Mengambil data profil
 *   PUT    /api/profil                     - Memperbarui profil (opsional beserta logo)
 *   DELETE /api/profil                     - Menghapus data profil
 *   GET    /api/profil/admins              - Mengambil daftar akun admin
 *   PATCH  /api/profil/admins/:id/password - Menyetel ulang kata sandi admin
 *   PATCH  /api/profil/admins/:id/name     - Mengubah nama admin
 */

const express = require("express");
const multer = require("multer");
const router = express.Router();

const profilController = require("../controllers/profilController");
const AppError = require("../utils/AppError");

// Berkas ditampung di memori, bukan ditulis ke disk, karena langsung
// diteruskan ke Supabase Storage. Ukuran dibatasi 2 MB per berkas.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

/**
 * Pembungkus middleware unggah logo.
 *
 * Multer melaporkan kegagalan (misalnya ukuran berkas melebihi batas) lewat
 * callback, bukan dengan melempar error. Akibatnya asyncHandler tidak dapat
 * menangkapnya dan error akan jatuh ke penanganan bawaan Express, lalu
 * tersamar menjadi kesalahan 500 yang tidak informatif.
 *
 * Pembungkus ini menerjemahkan kegagalan tersebut menjadi AppError dengan
 * kode 400, sehingga pengguna menerima pesan yang jelas.
 */
const uploadLogo = (req, res, next) => {
  upload.single("logo")(req, res, (err) => {
    if (!err) return next();

    console.error("[profilRoutes] logo upload middleware error:", err);

    if (err instanceof multer.MulterError) {
      return next(new AppError(`Gagal mengunggah logo: ${err.message}`, 400));
    }
    return next(new AppError(err.message || "Gagal mengunggah logo", 400));
  });
};

// Profil bank sampah
router.get("/", profilController.getProfil);
router.put("/", uploadLogo, profilController.updateProfil);
router.delete("/", profilController.deleteProfil);

// Pengelolaan akun admin
router.get("/admins", profilController.listAdmins);
router.patch("/admins/:id/password", profilController.resetAdminPassword);
router.patch("/admins/:id/name", profilController.updateAdminName);

module.exports = router;
