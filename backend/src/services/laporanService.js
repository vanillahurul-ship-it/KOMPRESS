/**
 * Service Laporan
 *
 * Menyusun rekapitulasi transaksi per bulan untuk satu tahun tertentu.
 * Data mentahnya diambil dari transaksiService, service ini hanya menyaring
 * berdasarkan tahun lalu menghitung totalnya.
 */

const transaksiService = require("./transaksiService");

// Nama bulan berbahasa Indonesia untuk label pada tabel laporan
const BULAN_LABEL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/**
 * Menyusun laporan pendapatan dan berat sampah per bulan.
 *
 * Bila tahun tidak ditentukan, dipilih tahun terbaru yang memiliki data.
 * Dengan begitu halaman laporan langsung menampilkan isi saat pertama dibuka,
 * bukan tabel kosong.
 *
 * @param {number|string} [tahun] - Tahun yang ingin ditampilkan.
 * @returns {Promise<{
 *   tahun: number,
 *   available_years: number[],
 *   rows: Array<object>,
 *   total_pendapatan: number,
 *   total_berat: number,
 *   total_transaksi: number
 * }>} Data laporan beserta daftar tahun yang tersedia untuk filter.
 */
const getLaporan = async (tahun) => {
  const allRows = await transaksiService.getPendapatanBulanan();

  // Daftar tahun untuk pilihan filter, diurutkan dari yang terbaru
  const availableYears = [...new Set(allRows.map((row) => row.tahun))].sort((a, b) => b - a);

  const targetYear = tahun || availableYears[0] || new Date().getFullYear();

  const rows = allRows
    .filter((row) => row.tahun === Number(targetYear))
    .map((row) => ({
      bulan_num: row.bulan_num,
      bulan: BULAN_LABEL[row.bulan_num - 1],
      jumlah_transaksi: row.jumlah_transaksi,
      total_berat: row.total_berat,
      pendapatan: row.total_pendapatan,
    }));

  return {
    tahun: Number(targetYear),
    available_years: availableYears,
    rows,
    total_pendapatan: rows.reduce((sum, row) => sum + Number(row.pendapatan), 0),
    total_berat: rows.reduce((sum, row) => sum + Number(row.total_berat), 0),
    total_transaksi: rows.reduce((sum, row) => sum + Number(row.jumlah_transaksi), 0),
  };
};

module.exports = { getLaporan };
