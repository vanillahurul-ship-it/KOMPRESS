const supabase = require("../config/supabase");
const prediksiService = require("./prediksiService");
const transaksiService = require("./transaksiService");

const getTren = () => transaksiService.getPendapatanBulanan();

const getDashboardSummary = async () => {
  const tren = await getTren();
  const last12 = tren.slice(-12);

  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const bulanKey = (row) => `${row.tahun}-${String(row.bulan_num).padStart(2, "0")}`;

  const bulanIni = tren.find((row) => bulanKey(row) === currentKey);
  const bulanLaluDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const bulanLaluKey = `${bulanLaluDate.getFullYear()}-${String(bulanLaluDate.getMonth() + 1).padStart(2, "0")}`;
  const bulanLalu = tren.find((row) => bulanKey(row) === bulanLaluKey);

  const pendapatanBulanIni = bulanIni?.total_pendapatan || 0;
  const pendapatanBulanLalu = bulanLalu?.total_pendapatan || 0;
  const persentaseDariBulanLalu =
    pendapatanBulanLalu > 0
      ? Number((((pendapatanBulanIni - pendapatanBulanLalu) / pendapatanBulanLalu) * 100).toFixed(1))
      : null;

  const [{ count: jumlahNasabah }, { count: jumlahTransaksi }] = await Promise.all([
    supabase.from("nasabah").select("id", { count: "exact", head: true }),
    supabase.from("transaksi").select("id", { count: "exact", head: true }),
  ]);

  let prediksiRingkas = null;
  try {
    prediksiRingkas = await prediksiService.runPrediksi(6);
  } catch (_err) {
    // Not enough history yet to run a prediction — dashboard still renders without it.
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
