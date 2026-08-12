/**
 * Pemformatan Tanggal
 *
 * Mengubah tanggal menjadi teks berbahasa Indonesia untuk ditampilkan, serta
 * menyediakan pengubahan sebaliknya ke format yang dikenali input tanggal HTML.
 */

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/**
 * Mengubah tanggal menjadi teks seperti "12 Agustus 2026".
 *
 * Nilai kosong maupun tanggal yang tidak valid dikembalikan sebagai tanda
 * hubung, sehingga tabel tetap rapi walau datanya bermasalah.
 *
 * @param {string|Date} value - Tanggal yang ingin diformat.
 * @returns {string} Teks tanggal, atau "-" bila tidak valid.
 */
export const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getDate()} ${BULAN[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Menyusun label bulan dan tahun, misalnya "Agustus 2026".
 *
 * Dipakai pada sumbu grafik dan tabel laporan yang datanya sudah berupa
 * pasangan nomor bulan dan tahun, bukan tanggal lengkap.
 *
 * @param {number} bulanNum - Nomor bulan (1-12).
 * @param {number} tahun - Tahun.
 * @returns {string} Label bulan beserta tahunnya.
 */
export const formatBulanTahun = (bulanNum, tahun) => `${BULAN[bulanNum - 1]} ${tahun}`;

/**
 * Mengubah tanggal menjadi format "YYYY-MM-DD".
 *
 * Format tersebut merupakan satu-satunya format yang diterima oleh elemen
 * input bertipe date, sehingga fungsi ini dipakai saat mengisi form ubah data.
 *
 * @param {string|Date} value - Tanggal yang ingin diubah.
 * @returns {string} Tanggal siap pakai untuk input, atau teks kosong bila tidak valid.
 */
export const toInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};
