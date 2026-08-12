/**
 * Daftar Status dan Gaya Tampilannya
 *
 * Berisi pilihan status yang dipakai pada dropdown serta pasangan warna untuk
 * menampilkannya sebagai badge.
 *
 * Nilai status di sini harus sama persis dengan yang divalidasi backend
 * (lihat transaksiController.js dan nasabahController.js), sebab nilai inilah
 * yang dikirim saat pengguna mengubah status.
 */

/** Pilihan status transaksi setoran. */
export const TRANSAKSI_STATUS = ["Belum Diproses", "Sedang Diproses", "Selesai"];

/** Pilihan status keaktifan nasabah. */
export const NASABAH_STATUS = ["Aktif", "Tidak Aktif"];

/**
 * Warna latar (bg) dan warna teks (text) untuk setiap status.
 *
 * Status transaksi dan status nasabah sengaja disatukan dalam satu objek agar
 * komponen StatusBadge dapat dipakai bersama di kedua modul tanpa perlu
 * mengetahui asal statusnya.
 */
export const STATUS_BADGE_STYLE = {
  // Status transaksi
  "Belum Diproses": { bg: "#F1E4C3", text: "#8A6D1D" },
  "Sedang Diproses": { bg: "#D9E6F5", text: "#2C5C8A" },
  Selesai: { bg: "#DCEBD3", text: "#39701A" },

  // Status nasabah
  Aktif: { bg: "#DCEBD3", text: "#39701A" },
  "Tidak Aktif": { bg: "#F1D6D3", text: "#A13B33" },
};
