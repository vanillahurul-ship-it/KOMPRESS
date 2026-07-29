const nasabahService = require("../services/nasabahService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { ok, created } = require("../utils/response");

const normalizeStatus = (status) => (status === "Tidak Aktif" ? "Tidak Aktif" : "Aktif");

exports.getAllNasabah = asyncHandler(async (req, res) => {
  const data = await nasabahService.getAllNasabah();
  return ok(res, data);
});

exports.createNasabah = asyncHandler(async (req, res) => {
  const { nama, no_rekening, alamat, status } = req.body || {};

  if (!nama?.trim() || !no_rekening?.trim() || !alamat?.trim()) {
    throw new AppError("Nama, nomor rekening, dan alamat wajib diisi", 400);
  }

  // saldo is never accepted from the client — it's always derived from the
  // nasabah's transaksi history (see nasabahService.withComputedSaldo), so a
  // brand-new nasabah simply starts at 0 until their first setoran.
  const payload = {
    nama: nama.trim(),
    no_rekening: no_rekening.trim(),
    alamat: alamat.trim(),
    saldo: 0,
    status: normalizeStatus(status),
  };

  const data = await nasabahService.createNasabah(payload);
  return created(res, data, "Nasabah berhasil ditambahkan");
});

exports.updateNasabah = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { nama, no_rekening, alamat, status } = req.body || {};

  if (!nama?.trim() || !no_rekening?.trim() || !alamat?.trim()) {
    throw new AppError("Nama, nomor rekening, dan alamat wajib diisi", 400);
  }

  const payload = {
    nama: nama.trim(),
    no_rekening: no_rekening.trim(),
    alamat: alamat.trim(),
    status: status ? normalizeStatus(status) : undefined,
  };

  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

  const data = await nasabahService.updateNasabah(id, payload);
  return ok(res, data, "Nasabah berhasil diperbarui");
});

exports.deleteNasabah = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await nasabahService.deleteNasabah(id);
  return ok(res, null, "Nasabah berhasil dihapus");
});
