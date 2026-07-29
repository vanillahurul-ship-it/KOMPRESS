const express = require("express");
const multer = require("multer");
const router = express.Router();

const profilController = require("../controllers/profilController");
const AppError = require("../utils/AppError");

// In-memory storage: the file is forwarded straight to Supabase Storage, never written to disk.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

// multer reports errors (e.g. file too large) via the callback, not by throwing —
// asyncHandler can't catch that, so without this wrapper it falls through to the
// default Express error handler and gets masked as a generic 500.
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

router.get("/", profilController.getProfil);
router.put("/", uploadLogo, profilController.updateProfil);
router.delete("/", profilController.deleteProfil);
router.get("/admins", profilController.listAdmins);
router.patch("/admins/:id/password", profilController.resetAdminPassword);
router.patch("/admins/:id/name", profilController.updateAdminName);

module.exports = router;
