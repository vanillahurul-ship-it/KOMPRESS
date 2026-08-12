/**
 * Controller Nasabah
 *
 * Menangani operasi CRUD data nasabah bank sampah.
 *
 * Catatan penting: saldo nasabah tidak pernah diterima dari frontend. Nilai
 * saldo selalu dihitung ulang dari riwayat transaksi nasabah yang
 * bersangkutan (lihat nasabahService.withComputedSaldo), sehingga saldo
 * tidak dapat dimanipulasi lewat form.
 */

const nasabahService = require("../services/nasabahService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { ok, created } = require("../utils/response");

/**
 * Menyeragamkan nilai status nasabah.
 *
 * Hanya ada dua status yang diakui sistem. Nilai apa pun selain
 * "Tidak Aktif" dianggap "Aktif" agar data di basis data tetap bersih.
 *
 * @param {string} status - Status mentah dari frontend.
 * @returns {"Aktif"|"Tidak Aktif"}
 */
const normalizeStatus = (status) => (status === "Tidak Aktif" ? "Tidak Aktif" : "Aktif");

/**
 * GET /api/nasabah
 *
 * Mengambil daftar seluruh nasabah beserta saldo hasil perhitungan.
 */
exports.getAllNasabah = asyncHandler(async (req, res) => {
  const data = await nasabahService.getAllNasabah();
  return ok(res, data);
});

/**
 * POST /api/nasabah
 *
 * Body: { nama, no_rekening, alamat, status }
 *
 * Nasabah baru selalu dimulai dengan saldo 0 dan akan bertambah dengan
 * sendirinya setelah setoran pertamanya tercatat.
 */
exports.createNasabah = asyncHandler(async (req, res) => {
  const { nama, no_rekening, alamat, status } = req.body || {};

  if (!nama?.trim() || !no_rekening?.trim() || !alamat?.trim()) {
    throw new AppError("Nama, nomor rekening, dan alamat wajib diisi", 400);
  }

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

/**
 * PUT /api/nasabah/:id
 *
 * Body: { nama, no_rekening, alamat, status }
 *
 * Status bersifat opsional. Bila tidak dikirim, field tersebut dibuang dari
 * payload supaya nilai yang tersimpan di basis data tidak ikut tertimpa.
 */
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

  // Buang field yang tidak dikirim agar tidak menimpa data lama dengan nilai kosong
  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

  const data = await nasabahService.updateNasabah(id, payload);
  return ok(res, data, "Nasabah berhasil diperbarui");
});

/**
 * DELETE /api/nasabah/:id
 */
exports.deleteNasabah = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await nasabahService.deleteNasabah(id);
  return ok(res, null, "Nasabah berhasil dihapus");
});
