const supabase = require("../config/supabase");
const transaksiService = require("./transaksiService");

// Saldo is not stored per-nasabah; it's computed from the transaksi table on
// every read so it always reflects the latest setoran data (see
// transaksiService.getSaldoPerNasabah).
const withComputedSaldo = async (rows) => {
  const saldoByNama = await transaksiService.getSaldoPerNasabah();
  return rows.map((nasabah) => ({
    ...nasabah,
    saldo: saldoByNama.get(nasabah.nama) || 0,
  }));
};

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
