const transaksiService = require("./transaksiService");

const BULAN_LABEL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const getLaporan = async (tahun) => {
  const allRows = await transaksiService.getPendapatanBulanan();
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
