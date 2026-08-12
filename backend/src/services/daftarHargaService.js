/**
 * Service Daftar Harga (Jenis Sampah)
 *
 * Mengelola tabel `daftar_harga` di Supabase, yaitu daftar jenis sampah
 * beserta harga beli dari nasabah dan harga jual ke DLH per kilogram.
 *
 * Nama tabel di basis data adalah `daftar_harga`, bukan `jenis_sampah`, dan
 * nama kolomnya masih memakai spasi serta huruf kapital karena data awalnya
 * diimpor dari berkas spreadsheet. Agar bagian lain aplikasi tidak ikut
 * terbebani penamaan tersebut, service ini menerjemahkan bentuk data melalui
 * fungsi toApiShape dan toDbShape.
 */

const supabase = require("../config/supabase");

// Daftar kolom yang diambil; tanda kutip diperlukan karena nama kolom berspasi
const COLUMNS = '"Jenis Sampah", "Harga Ke Nasabah/Kg", "Harga ke DLH/Kg", id';

/**
 * Mengubah baris dari basis data menjadi bentuk yang dipakai aplikasi.
 *
 * @param {object} row - Baris mentah dari tabel daftar_harga.
 * @returns {{id: number, nama: string, harga_per_kg: number, harga_dlh_per_kg: number}}
 */
const toApiShape = (row) => ({
  id: row.id,
  nama: row["Jenis Sampah"],
  harga_per_kg: row["Harga Ke Nasabah/Kg"],
  harga_dlh_per_kg: row["Harga ke DLH/Kg"],
});

/**
 * Mengubah data aplikasi kembali ke bentuk kolom basis data.
 *
 * Hanya field yang benar-benar dikirim yang disertakan, sehingga fungsi ini
 * aman dipakai untuk pembaruan sebagian (partial update).
 *
 * @param {object} payload - Data dalam bentuk aplikasi.
 * @returns {object} Objek siap simpan dengan nama kolom asli.
 */
const toDbShape = (payload) => {
  const row = {};
  if (payload.nama !== undefined) row["Jenis Sampah"] = payload.nama;
  if (payload.harga_per_kg !== undefined) row["Harga Ke Nasabah/Kg"] = payload.harga_per_kg;
  if (payload.harga_dlh_per_kg !== undefined) row["Harga ke DLH/Kg"] = payload.harga_dlh_per_kg;
  return row;
};

/**
 * Mengambil seluruh jenis sampah, diurutkan berdasarkan nama.
 *
 * @returns {Promise<Array<object>>} Daftar jenis sampah.
 */
const getAllDaftarHarga = async () => {
  const { data, error } = await supabase
    .from("daftar_harga")
    .select(COLUMNS)
    .order("Jenis Sampah", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(toApiShape);
};

/**
 * Menambahkan satu jenis sampah baru.
 *
 * @param {object} payload - Data jenis sampah yang sudah divalidasi controller.
 * @returns {Promise<object>} Data yang berhasil tersimpan.
 */
const createDaftarHarga = async (payload) => {
  const { data, error } = await supabase
    .from("daftar_harga")
    .insert([toDbShape(payload)])
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return toApiShape(data);
};

/**
 * Memperbarui satu jenis sampah berdasarkan id.
 *
 * @param {number|string} id - Id jenis sampah.
 * @param {object} payload - Data baru.
 * @returns {Promise<object>} Data setelah diperbarui.
 */
const updateDaftarHarga = async (id, payload) => {
  const { data, error } = await supabase
    .from("daftar_harga")
    .update(toDbShape(payload))
    .eq("id", id)
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return toApiShape(data);
};

/**
 * Menghapus satu jenis sampah berdasarkan id.
 *
 * @param {number|string} id - Id jenis sampah.
 * @returns {Promise<boolean>} Bernilai true bila berhasil.
 */
const deleteDaftarHarga = async (id) => {
  const { error } = await supabase.from("daftar_harga").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
};

/**
 * Mencari harga per kilogram suatu jenis sampah berdasarkan namanya.
 *
 * Dipakai transaksiController saat mencatat setoran. Harga yang diperoleh
 * kemudian disalin ke dalam data transaksi, supaya perubahan daftar harga di
 * kemudian hari tidak mengubah nilai transaksi yang sudah tercatat.
 *
 * @param {string} namaJenisSampah - Nama jenis sampah yang dicari.
 * @returns {Promise<number>} Harga per kilogram.
 * @throws {Error} Bila jenis sampah tidak terdaftar di daftar harga.
 */
const getHargaPerKg = async (namaJenisSampah) => {
  const { data, error } = await supabase
    .from("daftar_harga")
    .select('"Harga Ke Nasabah/Kg"')
    .eq("Jenis Sampah", namaJenisSampah)
    .single();

  if (error) throw new Error("Jenis sampah tidak ditemukan di daftar harga");
  return Number(data["Harga Ke Nasabah/Kg"]);
};

module.exports = {
  getAllDaftarHarga,
  createDaftarHarga,
  updateDaftarHarga,
  deleteDaftarHarga,
  getHargaPerKg,
};
