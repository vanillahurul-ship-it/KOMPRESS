const supabase = require("../config/supabase");

const BULAN_LABEL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const COLUMNS = '"Bulan", "Tanggal", "Nama Nasabah", "Jenis Sampah", "Berat (Kg)", "Harga Satuan", "Total Setoran (Rp)", status, id';

// The real `transaksi` table has no FK columns and uses spaced/capitalised
// column names (it was imported from a spreadsheet) — map it to a stable,
// camel/snake-cased shape the frontend and other services can rely on.
const toApiShape = (row) => ({
  id: row.id,
  bulan: row["Bulan"],
  tanggal: row["Tanggal"],
  nama_nasabah: row["Nama Nasabah"],
  jenis_sampah: row["Jenis Sampah"],
  berat_kg: row["Berat (Kg)"],
  harga_satuan: row["Harga Satuan"],
  total: row["Total Setoran (Rp)"],
  status: row.status,
});

const toDbShape = (payload) => {
  const row = {};
  if (payload.bulan !== undefined) row["Bulan"] = payload.bulan;
  if (payload.tanggal !== undefined) row["Tanggal"] = payload.tanggal;
  if (payload.nama_nasabah !== undefined) row["Nama Nasabah"] = payload.nama_nasabah;
  if (payload.jenis_sampah !== undefined) row["Jenis Sampah"] = payload.jenis_sampah;
  if (payload.berat_kg !== undefined) row["Berat (Kg)"] = payload.berat_kg;
  if (payload.harga_satuan !== undefined) row["Harga Satuan"] = payload.harga_satuan;
  if (payload.total !== undefined) row["Total Setoran (Rp)"] = payload.total;
  if (payload.status !== undefined) row.status = payload.status;
  return row;
};

// PostgREST caps a single request at 1000 rows by default — the `transaksi`
// table already exceeds that, so both the list and the revenue aggregation
// below must page through with `.range()` or they'd silently drop rows.
const PAGE_SIZE = 1000;

const fetchAllRows = async (select) => {
  let allRows = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("transaksi")
      .select(select)
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw new Error(error.message);
    allRows = allRows.concat(data || []);
    if (!data || data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return allRows;
};

const getAllTransaksi = async () => {
  const rows = await fetchAllRows(COLUMNS);
  return rows
    .map(toApiShape)
    .sort((a, b) => (b.tanggal || "").localeCompare(a.tanggal || "") || b.id - a.id);
};

const createTransaksi = async (payload) => {
  const { data, error } = await supabase
    .from("transaksi")
    .insert([toDbShape(payload)])
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return toApiShape(data);
};

const updateTransaksi = async (id, payload) => {
  const { data, error } = await supabase
    .from("transaksi")
    .update(toDbShape(payload))
    .eq("id", id)
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return toApiShape(data);
};

const updateStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("transaksi")
    .update({ status })
    .eq("id", id)
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return toApiShape(data);
};

const deleteTransaksi = async (id) => {
  const { error } = await supabase.from("transaksi").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
};

// Aggregates the `transaksi` table into one row per calendar month, in the
// shape the dashboard/laporan/prediksi features consume (replaces the
// `v_pendapatan_bulanan` view, which does not exist on the live database).
const getPendapatanBulanan = async () => {
  const data = await fetchAllRows('"Tanggal", "Berat (Kg)", "Total Setoran (Rp)"');

  const byMonth = new Map();
  for (const row of data) {
    const tanggal = row["Tanggal"];
    if (!tanggal) continue;
    const [tahunStr, bulanStr] = tanggal.split("-");
    const tahun = Number(tahunStr);
    const bulan_num = Number(bulanStr);
    const key = `${tahun}-${bulan_num}`;

    if (!byMonth.has(key)) {
      byMonth.set(key, { tahun, bulan_num, jumlah_transaksi: 0, total_berat: 0, total_pendapatan: 0 });
    }
    const entry = byMonth.get(key);
    entry.jumlah_transaksi += 1;
    entry.total_berat += Number(row["Berat (Kg)"] || 0);
    entry.total_pendapatan += Number(row["Total Setoran (Rp)"] || 0);
  }

  return [...byMonth.values()]
    .sort((a, b) => a.tahun - b.tahun || a.bulan_num - b.bulan_num)
    .map((row) => ({ ...row, bulan: BULAN_LABEL[row.bulan_num - 1] }));
};

// Nasabah saldo is derived data, not a stored value: it's the running sum of
// every transaksi recorded against that nasabah's name (the `transaksi` table
// has no nasabah_id FK, so name is the only join key available).
const getSaldoPerNasabah = async () => {
  const rows = await fetchAllRows('"Nama Nasabah", "Total Setoran (Rp)"');

  const saldoByNama = new Map();
  for (const row of rows) {
    const nama = row["Nama Nasabah"];
    if (!nama) continue;
    const total = Number(row["Total Setoran (Rp)"] || 0);
    saldoByNama.set(nama, (saldoByNama.get(nama) || 0) + total);
  }

  return saldoByNama;
};

module.exports = {
  getAllTransaksi,
  createTransaksi,
  updateTransaksi,
  updateStatus,
  deleteTransaksi,
  getPendapatanBulanan,
  getSaldoPerNasabah,
};
