/**
 * Service Nasabah
 *
 * Mengelola tabel `nasabah` di Supabase.
 *
 * Hal penting yang perlu dipahami: saldo nasabah bukan nilai yang disimpan
 * dan diubah manual, melainkan dihitung ulang dari tabel transaksi setiap
 * kali data dibaca. Pendekatan ini dipilih agar saldo tidak pernah selisih
 * dengan riwayat setoran yang sebenarnya.
 */

const supabase = require("../config/supabase");
const transaksiService = require("./transaksiService");

/**
 * Melengkapi data nasabah dengan saldo hasil perhitungan.
 *
 * Saldo diambil dari total seluruh setoran atas nama nasabah tersebut
 * (lihat transaksiService.getSaldoPerNasabah). Nasabah yang belum pernah
 * menyetor akan bersaldo 0.
 *
 * @param {Array<object>} rows - Daftar nasabah dari basis data.
 * @returns {Promise<Array<object>>} Daftar nasabah beserta saldonya.
 */
const withComputedSaldo = async (rows) => {
  const saldoByNama = await transaksiService.getSaldoPerNasabah();
  return rows.map((nasabah) => ({
    ...nasabah,
    saldo: saldoByNama.get(nasabah.nama) || 0,
  }));
};

/**
 * Mengambil seluruh nasabah beserta saldonya, diurutkan berdasarkan id.
 *
 * @returns {Promise<Array<object>>} Daftar nasabah.
 */
const getAllNasabah = async () => {
  const { data, error } = await supabase
    .from("nasabah")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return withComputedSaldo(data);
};

/**
 * Menyimpan nasabah baru.
 *
 * @param {object} nasabah - Data nasabah yang sudah divalidasi controller.
 * @returns {Promise<object>} Data nasabah yang tersimpan beserta saldonya.
 */
const createNasabah = async (nasabah) => {
  const { data, error } = await supabase
    .from("nasabah")
    .insert([nasabah])
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const [withSaldo] = await withComputedSaldo([data]);
  return withSaldo;
};

/**
 * Memperbarui data nasabah berdasarkan id.
 *
 * @param {number|string} id - Id nasabah.
 * @param {object} nasabah - Field yang ingin diperbarui.
 * @returns {Promise<object>} Data nasabah setelah diperbarui.
 */
const updateNasabah = async (id, nasabah) => {
  const { data, error } = await supabase
    .from("nasabah")
    .update(nasabah)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const [withSaldo] = await withComputedSaldo([data]);
  return withSaldo;
};

/**
 * Menghapus nasabah berdasarkan id.
 *
 * @param {number|string} id - Id nasabah.
 * @returns {Promise<boolean>} Bernilai true bila berhasil.
 */
const deleteNasabah = async (id) => {
  const { error } = await supabase
    .from("nasabah")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

module.exports = {
  getAllNasabah,
  createNasabah,
  updateNasabah,
  deleteNasabah,
};
