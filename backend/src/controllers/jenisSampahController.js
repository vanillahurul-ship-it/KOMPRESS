const daftarHargaService = require("../services/daftarHargaService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { ok, created } = require("../utils/response");

const buildPayload = (body) => {
  const { nama, harga_per_kg, harga_dlh_per_kg } = body || {};

  if (!nama?.trim()) {
    throw new AppError("Nama jenis sampah wajib diisi", 400);
  }

  const harga = Number(harga_per_kg);
  if (Number.isNaN(harga) || harga < 0) {
    throw new AppError("Harga tidak boleh negatif", 400);
  }

  const hargaDlh = Number(harga_dlh_per_kg ?? 0);
  if (Number.isNaN(hargaDlh) || hargaDlh < 0) {
    throw new AppError("Harga ke DLH tidak boleh negatif", 400);
  }

  return {
    nama: nama.trim(),
    harga_per_kg: harga,
    harga_dlh_per_kg: hargaDlh,
  };
};

exports.getAllJenisSampah = asyncHandler(async (req, res) => {
  const data = await daftarHargaService.getAllDaftarHarga();
  return ok(res, data);
});

exports.createJenisSampah = asyncHandler(async (req, res) => {
  const payload = buildPayload(req.body);
  const data = await daftarHargaService.createDaftarHarga(payload);
  return created(res, data, "Jenis sampah berhasil ditambahkan");
});

exports.updateJenisSampah = asyncHandler(async (req, res) => {
  const payload = buildPayload(req.body);
  const data = await daftarHargaService.updateDaftarHarga(req.params.id, payload);
  return ok(res, data, "Jenis sampah berhasil diperbarui");
});

exports.deleteJenisSampah = asyncHandler(async (req, res) => {
  await daftarHargaService.deleteDaftarHarga(req.params.id);
  return ok(res, null, "Jenis sampah berhasil dihapus");
});
