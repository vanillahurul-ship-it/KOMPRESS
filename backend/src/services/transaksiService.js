/**
 * Service Transaksi
 *
 * Mengelola tabel `transaksi` di Supabase sekaligus menyediakan hasil
 * agregasinya untuk modul dashboard, laporan, dan prediksi.
 *
 * Dua hal yang perlu diperhatikan pada tabel ini:
 *
 * 1. Nama kolomnya masih memakai spasi dan huruf kapital karena data awalnya
 *    diimpor dari spreadsheet. Penerjemahan bentuk data dilakukan lewat
 *    toApiShape dan toDbShape agar bagian lain aplikasi memakai penamaan yang
 *    konsisten.
 *
 * 2. Tabel ini tidak memiliki kolom relasi (foreign key) ke tabel nasabah,
 *    sehingga penggabungan data hanya bisa dilakukan lewat kolom nama nasabah.
 */

const supabase = require("../config/supabase");

// Nama bulan berbahasa Indonesia untuk label laporan dan grafik
const BULAN_LABEL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// Daftar kolom yang diambil; tanda kutip diperlukan karena nama kolom berspasi
const COLUMNS = '"Bulan", "Tanggal", "Nama Nasabah", "Jenis Sampah", "Berat (Kg)", "Harga Satuan", "Total Setoran (Rp)", status, id';

/**
 * Mengubah baris basis data menjadi bentuk yang dipakai aplikasi.
 *
 * @param {object} row - Baris mentah dari tabel transaksi.
 * @returns {object} Data transaksi dengan penamaan field yang seragam.
 */
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

/**
 * Mengubah data aplikasi kembali ke bentuk kolom basis data.
 *
 * Hanya field yang benar-benar dikirim yang disertakan, sehingga aman dipakai
 * untuk pembaruan sebagian (partial update).
 *
 * @param {object} payload - Data dalam bentuk aplikasi.
 * @returns {object} Objek siap simpan dengan nama kolom asli.
 */
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

// Supabase (PostgREST) membatasi satu permintaan maksimal 1000 baris.
// Jumlah data transaksi sudah melebihi angka tersebut, sehingga pengambilan
// data wajib dilakukan bertahap agar tidak ada baris yang terpotong diam-diam.
const PAGE_SIZE = 1000;

/**
 * Mengambil seluruh baris tabel transaksi secara bertahap per 1000 baris.
 *
 * Perulangan berhenti ketika jumlah baris yang diterima kurang dari
 * PAGE_SIZE, yang menandakan halaman terakhir sudah tercapai.
 *
 * @param {string} select - Daftar kolom yang ingin diambil.
 * @returns {Promise<Array<object>>} Seluruh baris hasil penggabungan halaman.
 */
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

/**
 * Mengambil seluruh transaksi, diurutkan dari yang terbaru.
 *
 * Bila tanggalnya sama, urutan ditentukan oleh id yang lebih besar sehingga
 * transaksi yang paling akhir dicatat tampil lebih dahulu.
 *
 * @returns {Promise<Array<object>>} Daftar transaksi.
 */
const getAllTransaksi = async () => {
  const rows = await fetchAllRows(COLUMNS);
  return rows
    .map(toApiShape)
    .sort((a, b) => (b.tanggal || "").localeCompare(a.tanggal || "") || b.id - a.id);
};

/**
 * Menyimpan transaksi setoran baru.
 *
 * @param {object} payload - Data transaksi yang sudah dihitung controller.
 * @returns {Promise<object>} Transaksi yang berhasil tersimpan.
 */
const createTransaksi = async (payload) => {
  const { data, error } = await supabase
    .from("transaksi")
    .insert([toDbShape(payload)])
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return toApiShape(data);
};

/**
 * Memperbarui transaksi berdasarkan id.
 *
 * @param {number|string} id - Id transaksi.
 * @param {object} payload - Field yang ingin diperbarui.
 * @returns {Promise<object>} Transaksi setelah diperbarui.
 */
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

/**
 * Mengubah status transaksi saja.
 *
 * @param {number|string} id - Id transaksi.
 * @param {string} status - Status baru.
 * @returns {Promise<object>} Transaksi setelah diperbarui.
 */
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

/**
 * Menghapus transaksi berdasarkan id.
 *
 * @param {number|string} id - Id transaksi.
 * @returns {Promise<boolean>} Bernilai true bila berhasil.
 */
const deleteTransaksi = async (id) => {
  const { error } = await supabase.from("transaksi").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
};

/**
 * Merangkum seluruh transaksi menjadi satu baris per bulan.
 *
 * Hasilnya dipakai bersama oleh modul dashboard, laporan, dan prediksi.
 * Perangkuman dilakukan di sisi aplikasi, bukan lewat view basis data,
 * karena view `v_pendapatan_bulanan` tidak tersedia di basis data yang
 * sedang berjalan.
 *
 * @returns {Promise<Array<{
 *   tahun: number,
 *   bulan_num: number,
 *   bulan: string,
 *   jumlah_transaksi: number,
 *   total_berat: number,
 *   total_pendapatan: number
 * }>>} Rekap bulanan terurut dari bulan terlama ke terbaru.
 */
const getPendapatanBulanan = async () => {
  const data = await fetchAllRows('"Tanggal", "Berat (Kg)", "Total Setoran (Rp)"');

  // Kelompokkan transaksi ke dalam Map dengan kunci "tahun-bulan"
  const byMonth = new Map();
  for (const row of data) {
    const tanggal = row["Tanggal"];

    // Baris tanpa tanggal dilewati karena tidak dapat dimasukkan ke bulan mana pun
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

  // Urutkan secara kronologis lalu tambahkan label nama bulan
  return [...byMonth.values()]
    .sort((a, b) => a.tahun - b.tahun || a.bulan_num - b.bulan_num)
    .map((row) => ({ ...row, bulan: BULAN_LABEL[row.bulan_num - 1] }));
};

/**
 * Menghitung saldo setiap nasabah dari seluruh riwayat transaksinya.
 *
 * Saldo tidak disimpan sebagai kolom tersendiri, melainkan merupakan
 * penjumlahan seluruh setoran atas nama nasabah tersebut. Penggabungan
 * memakai nama karena tabel transaksi tidak memiliki kolom relasi ke tabel
 * nasabah.
 *
 * @returns {Promise<Map<string, number>>} Peta nama nasabah ke total saldonya.
 */
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
