/**
 * Service Dashboard
 *
 * Menyusun seluruh data ringkasan untuk halaman beranda admin: pendapatan
 * bulan berjalan, perbandingannya dengan bulan lalu, jumlah nasabah dan
 * transaksi, grafik tren 12 bulan terakhir, serta cuplikan hasil prediksi.
 */

const supabase = require("../config/supabase");
const prediksiService = require("./prediksiService");
const transaksiService = require("./transaksiService");

/** Mengambil rekap transaksi per bulan sebagai dasar seluruh perhitungan. */
const getTren = () => transaksiService.getPendapatanBulanan();

/**
 * Menghimpun seluruh data yang dibutuhkan halaman beranda.
 *
 * @returns {Promise<object>} Objek ringkasan beranda beserta data grafik.
 */
const getDashboardSummary = async () => {
  const tren = await getTren();

  // Grafik beranda hanya menampilkan 12 bulan terakhir
  const last12 = tren.slice(-12);

  // Kunci "YYYY-MM" dipakai untuk mencocokkan bulan berjalan dan bulan lalu
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const bulanKey = (row) => `${row.tahun}-${String(row.bulan_num).padStart(2, "0")}`;

  const bulanIni = tren.find((row) => bulanKey(row) === currentKey);

  // Memakai Date agar pergantian tahun tertangani dengan benar,
  // misalnya bulan lalu dari Januari adalah Desember tahun sebelumnya
  const bulanLaluDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const bulanLaluKey = `${bulanLaluDate.getFullYear()}-${String(bulanLaluDate.getMonth() + 1).padStart(2, "0")}`;
  const bulanLalu = tren.find((row) => bulanKey(row) === bulanLaluKey);

  const pendapatanBulanIni = bulanIni?.total_pendapatan || 0;
  const pendapatanBulanLalu = bulanLalu?.total_pendapatan || 0;

  // Persentase kenaikan atau penurunan dibanding bulan lalu.
  // Bernilai null bila bulan lalu tidak ada pemasukan, sebab pembagian dengan
  // nol tidak menghasilkan angka yang bermakna untuk ditampilkan.
  const persentaseDariBulanLalu =
    pendapatanBulanLalu > 0
      ? Number((((pendapatanBulanIni - pendapatanBulanLalu) / pendapatanBulanLalu) * 100).toFixed(1))
      : null;

  // Kedua perhitungan dijalankan bersamaan karena tidak saling bergantung.
  // Opsi head: true membuat Supabase hanya mengirim jumlah baris, bukan datanya.
  const [{ count: jumlahNasabah }, { count: jumlahTransaksi }] = await Promise.all([
    supabase.from("nasabah").select("id", { count: "exact", head: true }),
    supabase.from("transaksi").select("id", { count: "exact", head: true }),
  ]);

  // Cuplikan prediksi 6 bulan ke depan. Prediksi memerlukan data historis yang
  // cukup, jadi kegagalannya sengaja diabaikan agar beranda tetap dapat tampil.
  let prediksiRingkas = null;
  try {
    prediksiRingkas = await prediksiService.runPrediksi(6);
  } catch (_err) {
    prediksiRingkas = null;
  }

  return {
    pendapatan_bulan_ini: pendapatanBulanIni,
    persentase_dari_bulan_lalu: persentaseDariBulanLalu,
    total_berat_bulan_ini: bulanIni?.total_berat || 0,
    jumlah_nasabah: jumlahNasabah || 0,
    jumlah_transaksi: jumlahTransaksi || 0,
    total_pendapatan_12_bulan: last12.reduce((sum, row) => sum + Number(row.total_pendapatan), 0),
    tren_pendapatan_bulanan: last12.map((row) => ({
      bulan: row.bulan,
      bulan_num: row.bulan_num,
      tahun: row.tahun,
      pendapatan: row.total_pendapatan,
    })),
    tren_berat_bulanan: last12.map((row) => ({
      bulan: row.bulan,
      bulan_num: row.bulan_num,
      tahun: row.tahun,
      berat: row.total_berat,
    })),
    prediksi: prediksiRingkas,
  };
};

module.exports = { getDashboardSummary };
