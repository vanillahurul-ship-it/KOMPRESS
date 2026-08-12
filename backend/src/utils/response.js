/**
 * Format Response API
 *
 * Kumpulan fungsi bantu supaya seluruh endpoint mengembalikan struktur
 * response yang seragam. Dengan begitu frontend cukup memeriksa satu pola
 * yang sama untuk semua permintaan.
 *
 * Struktur response:
 *   Berhasil : { success: true,  message: string, data: any }
 *   Gagal    : { success: false, message: string }
 */

/**
 * Mengirim response berhasil.
 *
 * @param {import("express").Response} res - Objek response Express.
 * @param {any} data - Data yang dikirim ke frontend.
 * @param {string} [message="OK"] - Pesan keterangan.
 * @param {number} [status=200] - Kode status HTTP.
 */
const ok = (res, data, message = "OK", status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

/**
 * Mengirim response berhasil untuk data yang baru dibuat (HTTP 201).
 *
 * @param {import("express").Response} res - Objek response Express.
 * @param {any} data - Data hasil pembuatan.
 * @param {string} [message="Berhasil dibuat"] - Pesan keterangan.
 */
const created = (res, data, message = "Berhasil dibuat") => {
  return ok(res, data, message, 201);
};

/**
 * Mengirim response gagal.
 *
 * @param {import("express").Response} res - Objek response Express.
 * @param {string} [message="Terjadi kesalahan"] - Penjelasan kegagalan.
 * @param {number} [status=400] - Kode status HTTP.
 */
const fail = (res, message = "Terjadi kesalahan", status = 400) => {
  return res.status(status).json({ success: false, message });
};

module.exports = { ok, created, fail };
