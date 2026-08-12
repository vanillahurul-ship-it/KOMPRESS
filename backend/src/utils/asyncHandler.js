/**
 * Pembungkus Fungsi Controller Asinkron
 *
 * Membungkus controller bertipe async agar error yang dilempar di dalamnya
 * otomatis diteruskan ke errorHandler. Tanpa pembungkus ini, setiap controller
 * harus menulis blok try/catch sendiri-sendiri.
 *
 * Contoh pemakaian:
 *   const getData = asyncHandler(async (req, res) => { ... });
 *
 * @param {Function} fn - Fungsi controller async yang ingin dibungkus.
 * @returns {Function} Fungsi middleware Express yang aman dari error tak tertangkap.
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
