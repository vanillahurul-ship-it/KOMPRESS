const profilService = require("../services/profilService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { ok } = require("../utils/response");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-\s()]{8,20}$/;

exports.getProfil = asyncHandler(async (req, res) => {
  console.log("[profilController] getProfil: request received");
  const data = await profilService.getProfil();
  return ok(res, data);
});

exports.updateProfil = asyncHandler(async (req, res) => {
  console.log(
    "[profilController] updateProfil: body =", req.body,
    "file =", req.file ? { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype } : null
  );

  const { nama_bank, alamat, no_hp, email, jam_operasional, deskripsi } = req.body || {};

  const payload = { nama_bank, alamat, no_hp, email, jam_operasional, deskripsi };
  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

  if ("nama_bank" in payload && !payload.nama_bank?.trim()) {
    throw new AppError("Nama bank sampah wajib diisi", 400);
  }
  if ("no_hp" in payload) {
    if (!payload.no_hp?.trim()) throw new AppError("Nomor telepon wajib diisi", 400);
    if (!PHONE_PATTERN.test(payload.no_hp.trim())) {
      throw new AppError("Format nomor telepon tidak valid", 400);
    }
  }
  if ("email" in payload) {
    if (!payload.email?.trim()) throw new AppError("Email wajib diisi", 400);
    if (!EMAIL_PATTERN.test(payload.email.trim())) {
      throw new AppError("Format email tidak valid", 400);
    }
  }
  if ("alamat" in payload && !payload.alamat?.trim()) {
    throw new AppError("Alamat wajib diisi", 400);
  }
  if ("jam_operasional" in payload && !payload.jam_operasional?.trim()) {
    throw new AppError("Jam operasional wajib diisi", 400);
  }

  const data = await profilService.updateProfil(payload, req.file);
  console.log("[profilController] updateProfil: success");
  return ok(res, data, "Perubahan berhasil disimpan");
});

exports.deleteProfil = asyncHandler(async (req, res) => {
  console.log("[profilController] deleteProfil: request received");
  await profilService.deleteProfil();
  console.log("[profilController] deleteProfil: success");
  return ok(res, null, "Data berhasil dihapus");
});

exports.listAdmins = asyncHandler(async (req, res) => {
  const data = await profilService.listAdmins();
  return ok(res, data);
});

exports.resetAdminPassword = asyncHandler(async (req, res) => {
  const { password } = req.body || {};

  if (!password || password.length < 8) {
    throw new AppError("Password minimal 8 karakter", 400);
  }

  const data = await profilService.resetAdminPassword(req.params.id, password);
  return ok(res, data, "Password admin berhasil diperbarui");
});

exports.updateAdminName = asyncHandler(async (req, res) => {
  const { name } = req.body || {};

  if (!name || !name.trim()) {
    throw new AppError("Nama wajib diisi", 400);
  }

  const data = await profilService.updateAdminName(req.params.id, name.trim());
  return ok(res, data, "Nama admin berhasil diperbarui");
});
