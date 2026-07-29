const transaksiService = require("../services/transaksiService");
const daftarHargaService = require("../services/daftarHargaService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { ok, created } = require("../utils/response");

const STATUS_VALUES = ["Belum Diproses", "Sedang Diproses", "Selesai"];

const BULAN_LABEL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const bulanFromTanggal = (tanggal) => {
  const bulanNum = Number(tanggal.split("-")[1]);
  return BULAN_LABEL[bulanNum - 1];
};

exports.getAllTransaksi = asyncHandler(async (req, res) => {
  const data = await transaksiService.getAllTransaksi();
  return ok(res, data);
});

exports.createTransaksi = asyncHandler(async (req, res) => {
  const { nama_nasabah, jenis_sampah, tanggal, berat_kg, status } = req.body || {};

  if (!nama_nasabah?.trim() || !jenis_sampah?.trim()) {
    throw new AppError("Nasabah dan jenis sampah wajib dipilih", 400);
  }

  const berat = Number(berat_kg);
  if (Number.isNaN(berat) || berat <= 0) {
    throw new AppError("Berat harus lebih besar dari 0", 400);
  }

  const harga_satuan = await daftarHargaService.getHargaPerKg(jenis_sampah.trim());
  const tanggalValue = tanggal || new Date().toISOString().slice(0, 10);

  const payload = {
    nama_nasabah: nama_nasabah.trim(),
    jenis_sampah: jenis_sampah.trim(),
    tanggal: tanggalValue,
    bulan: bulanFromTanggal(tanggalValue),
    berat_kg: berat,
    harga_satuan,
    total: Number((harga_satuan * berat).toFixed(2)),
    status: STATUS_VALUES.includes(status) ? status : "Belum Diproses",
  };

  const data = await transaksiService.createTransaksi(payload);
  return created(res, data, "Setoran berhasil ditambahkan");
});

exports.updateTransaksi = asyncHandler(async (req, res) => {
  const { nama_nasabah, jenis_sampah, tanggal, berat_kg } = req.body || {};

  const berat = Number(berat_kg);
  if (Number.isNaN(berat) || berat <= 0) {
    throw new AppError("Berat harus lebih besar dari 0", 400);
  }

  const payload = {
    nama_nasabah: nama_nasabah?.trim(),
    jenis_sampah: jenis_sampah?.trim(),
    tanggal,
    berat_kg: berat,
  };

  if (tanggal) {
    payload.bulan = bulanFromTanggal(tanggal);
  }

  // Re-snapshot the unit price (and total) only if the waste type changed.
  if (jenis_sampah) {
    payload.harga_satuan = await daftarHargaService.getHargaPerKg(jenis_sampah.trim());
    payload.total = Number((payload.harga_satuan * berat).toFixed(2));
  }

  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

  const data = await transaksiService.updateTransaksi(req.params.id, payload);
  return ok(res, data, "Setoran berhasil diperbarui");
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body || {};

  if (!STATUS_VALUES.includes(status)) {
    throw new AppError("Status tidak valid", 400);
  }

  const data = await transaksiService.updateStatus(req.params.id, status);
  return ok(res, data, "Status setoran berhasil diperbarui");
});

exports.deleteTransaksi = asyncHandler(async (req, res) => {
  await transaksiService.deleteTransaksi(req.params.id);
  return ok(res, null, "Setoran berhasil dihapus");
});
