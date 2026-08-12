/**
 * Controller Jenis Sampah
 *
 * Menangani operasi CRUD daftar harga sampah: nama jenis sampah, harga beli
 * dari nasabah per kilogram, dan harga jual ke DLH (Dinas Lingkungan Hidup)
 * per kilogram.
 *
 * Data pada modul ini menjadi acuan perhitungan total setoran di modul
 * transaksi, sehingga validasinya dibuat ketat.
 */

const daftarHargaService = require("../services/daftarHargaService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { ok, created } = require("../utils/response");

/**
 * Memvalidasi dan merapikan data dari form jenis sampah.
 *
 * Dipakai bersama oleh proses tambah dan ubah agar aturan validasinya
 * konsisten dan tidak ditulis dua kali.
 *
 * @param {object} body - Isi body request.
 * @returns {{nama: string, harga_per_kg: number, harga_dlh_per_kg: number}}
 * @throws {AppError} Bila nama kosong atau harga bernilai negatif.
 */
const buildPayload = (body) => {
  const { nama, harga_per_kg, harga_dlh_per_kg } = body || {};

  if (!nama?.trim()) {
    throw new AppError("Nama jenis sampah wajib diisi", 400);
  }

  const harga = Number(harga_per_kg);
  if (Number.isNaN(harga) || harga < 0) {
    throw new AppError("Harga tidak boleh negatif", 400);
  }

  // Harga ke DLH bersifat opsional, dianggap 0 bila tidak diisi
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

/**
 * GET /api/jenis-sampah
 *
 * Mengambil seluruh jenis sampah beserta harganya.
 */
exports.getAllJenisSampah = asyncHandler(async (req, res) => {
  const data = await daftarHargaService.getAllDaftarHarga();
  return ok(res, data);
});

/**
 * POST /api/jenis-sampah
 *
 * Body: { nama, harga_per_kg, harga_dlh_per_kg }
 */
exports.createJenisSampah = asyncHandler(async (req, res) => {
  const payload = buildPayload(req.body);
  const data = await daftarHargaService.createDaftarHarga(payload);
  return created(res, data, "Jenis sampah berhasil ditambahkan");
});

/**
 * PUT /api/jenis-sampah/:id
 *
 * Body: { nama, harga_per_kg, harga_dlh_per_kg }
 *
 * Perubahan harga di sini tidak memengaruhi transaksi yang sudah tercatat,
 * karena setiap transaksi menyimpan salinan harganya sendiri.
 */
exports.updateJenisSampah = asyncHandler(async (req, res) => {
  const payload = buildPayload(req.body);
  const data = await daftarHargaService.updateDaftarHarga(req.params.id, payload);
  return ok(res, data, "Jenis sampah berhasil diperbarui");
});

/**
 * DELETE /api/jenis-sampah/:id
 */
exports.deleteJenisSampah = asyncHandler(async (req, res) => {
  await daftarHargaService.deleteDaftarHarga(req.params.id);
  return ok(res, null, "Jenis sampah berhasil dihapus");
});
