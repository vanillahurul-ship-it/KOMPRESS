/**
 * Pemformatan Angka dan Mata Uang
 *
 * Mengubah angka menjadi teks berformat Indonesia, yaitu titik sebagai
 * pemisah ribuan dan koma sebagai pemisah desimal.
 */

// Formatter dibuat satu kali di luar fungsi karena pembuatan Intl.NumberFormat
// tergolong berat, sedangkan fungsi ini dipanggil berkali-kali saat tabel dan
// grafik ditampilkan.
const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  // Rupiah ditampilkan tanpa angka di belakang koma agar tabel lebih mudah dibaca
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Mengubah angka menjadi teks rupiah, misalnya "Rp15.000".
 *
 * Nilai yang kosong atau bukan angka diperlakukan sebagai 0 supaya tampilan
 * tidak pernah memunculkan tulisan "NaN".
 *
 * @param {number|string} value - Nilai yang ingin diformat.
 * @returns {string} Teks dalam format rupiah.
 */
export const formatCurrency = (value) => formatter.format(Number(value) || 0);

/**
 * Mengubah angka biasa menjadi teks dengan pemisah ribuan.
 *
 * Dipakai untuk nilai non-rupiah seperti berat sampah dalam kilogram.
 *
 * @param {number|string} value - Nilai yang ingin diformat.
 * @param {number} [fractionDigits=2] - Jumlah angka desimal maksimal.
 * @returns {string} Teks angka yang sudah diformat.
 */
export const formatNumber = (value, fractionDigits = 2) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: fractionDigits }).format(Number(value) || 0);
