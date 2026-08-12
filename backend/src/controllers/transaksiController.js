/**
 * Controller Transaksi
 *
 * Menangani pencatatan setoran sampah dari nasabah beserta perubahan dan
 * penghapusannya.
 *
 * Prinsip perhitungan yang dipakai di modul ini:
 *   - Harga satuan tidak diambil dari frontend, melainkan dibaca dari daftar
 *     harga di basis data. Dengan begitu nilai transaksi tidak bisa
 *     dimanipulasi dari sisi pengguna.
 *   - Harga tersebut disalin (snapshot) ke dalam data transaksi. Jika suatu
 *     saat daftar harga diubah, transaksi lama tetap memakai harga yang
 *     berlaku saat setoran itu dicatat.
 */

const transaksiService = require("../services/transaksiService");
const daftarHargaService = require("../services/daftarHargaService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { ok, created } = require("../utils/response");

// Status yang diakui sistem; nilai di luar daftar ini akan ditolak
const STATUS_VALUES = ["Belum Diproses", "Sedang Diproses", "Selesai"];

// Nama bulan dalam bahasa Indonesia, dipakai untuk label laporan dan grafik
const BULAN_LABEL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/**
 * Mengubah tanggal menjadi nama bulan berbahasa Indonesia.
 *
 * Nama bulan disimpan bersama transaksi agar laporan dan grafik tidak perlu
 * menghitung ulang dari tanggal setiap kali data ditampilkan.
 *
 * @param {string} tanggal - Tanggal dengan format YYYY-MM-DD.
 * @returns {string} Nama bulan, misalnya "Agustus".
 */
const bulanFromTanggal = (tanggal) => {
  const bulanNum = Number(tanggal.split("-")[1]);
  return BULAN_LABEL[bulanNum - 1];
};

/**
 * GET /api/transaksi
 *
 * Mengambil seluruh data transaksi setoran.
 */
exports.getAllTransaksi = asyncHandler(async (req, res) => {
  const data = await transaksiService.getAllTransaksi();
  return ok(res, data);
});

/**
 * POST /api/transaksi
 *
 * Body: { nama_nasabah, jenis_sampah, tanggal, berat_kg, status }
 *
 * Tanggal bersifat opsional; bila tidak diisi, dipakai tanggal hari ini.
 * Total setoran dihitung otomatis dari harga satuan dikali berat.
 */
exports.createTransaksi = asyncHandler(async (req, res) => {
  const { nama_nasabah, jenis_sampah, tanggal, berat_kg, status } = req.body || {};

  if (!nama_nasabah?.trim() || !jenis_sampah?.trim()) {
    throw new AppError("Nasabah dan jenis sampah wajib dipilih", 400);
  }

  const berat = Number(berat_kg);
  if (Number.isNaN(berat) || berat <= 0) {
    throw new AppError("Berat harus lebih besar dari 0", 400);
  }

  // Ambil harga yang berlaku saat ini lalu simpan sebagai bagian dari transaksi
  const harga_satuan = await daftarHargaService.getHargaPerKg(jenis_sampah.trim());
  const tanggalValue = tanggal || new Date().toISOString().slice(0, 10);

  const payload = {
    nama_nasabah: nama_nasabah.trim(),
    jenis_sampah: jenis_sampah.trim(),
    tanggal: tanggalValue,
    bulan: bulanFromTanggal(tanggalValue),
    berat_kg: berat,
    harga_satuan,
    // Dibulatkan dua angka di belakang koma agar tidak muncul pecahan rupiah
    total: Number((harga_satuan * berat).toFixed(2)),
    status: STATUS_VALUES.includes(status) ? status : "Belum Diproses",
  };

  const data = await transaksiService.createTransaksi(payload);
  return created(res, data, "Setoran berhasil ditambahkan");
});

/**
 * PUT /api/transaksi/:id
 *
 * Body: { nama_nasabah, jenis_sampah, tanggal, berat_kg }
 *
 * Field yang tidak dikirim akan dibuang dari payload sehingga data lama
 * tidak tertimpa nilai kosong.
 *
 * Harga satuan dan total hanya dihitung ulang bila jenis sampah ikut
 * dikirim, sebab hanya perubahan jenis sampah yang mengubah harga acuan.
 */
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

  // Label bulan ikut diperbarui bila tanggalnya berubah
  if (tanggal) {
    payload.bulan = bulanFromTanggal(tanggal);
  }

  if (jenis_sampah) {
    payload.harga_satuan = await daftarHargaService.getHargaPerKg(jenis_sampah.trim());
    payload.total = Number((payload.harga_satuan * berat).toFixed(2));
  }

  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

  const data = await transaksiService.updateTransaksi(req.params.id, payload);
  return ok(res, data, "Setoran berhasil diperbarui");
});

/**
 * PATCH /api/transaksi/:id/status
 *
 * Body: { status }
 *
 * Endpoint terpisah untuk mengubah status saja, dipakai oleh dropdown status
 * pada tabel transaksi agar tidak perlu mengirim ulang seluruh data.
 */
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body || {};

  if (!STATUS_VALUES.includes(status)) {
    throw new AppError("Status tidak valid", 400);
  }

  const data = await transaksiService.updateStatus(req.params.id, status);
  return ok(res, data, "Status setoran berhasil diperbarui");
});

/**
 * DELETE /api/transaksi/:id
 *
 * Menghapus transaksi. Saldo nasabah akan menyesuaikan dengan sendirinya
 * karena selalu dihitung ulang dari riwayat transaksi yang tersisa.
 */
exports.deleteTransaksi = asyncHandler(async (req, res) => {
  await transaksiService.deleteTransaksi(req.params.id);
  return ok(res, null, "Setoran berhasil dihapus");
});
