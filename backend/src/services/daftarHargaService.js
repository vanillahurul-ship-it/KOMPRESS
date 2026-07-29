const supabase = require("../config/supabase");

const COLUMNS = '"Jenis Sampah", "Harga Ke Nasabah/Kg", "Harga ke DLH/Kg", id';

// The real table is `daftar_harga` (price list), not `jenis_sampah` — map its
// spaced/capitalised columns to a stable shape for the rest of the app.
const toApiShape = (row) => ({
  id: row.id,
  nama: row["Jenis Sampah"],
  harga_per_kg: row["Harga Ke Nasabah/Kg"],
  harga_dlh_per_kg: row["Harga ke DLH/Kg"],
});

const toDbShape = (payload) => {
  const row = {};
  if (payload.nama !== undefined) row["Jenis Sampah"] = payload.nama;
  if (payload.harga_per_kg !== undefined) row["Harga Ke Nasabah/Kg"] = payload.harga_per_kg;
  if (payload.harga_dlh_per_kg !== undefined) row["Harga ke DLH/Kg"] = payload.harga_dlh_per_kg;
  return row;
};

const getAllDaftarHarga = async () => {
  const { data, error } = await supabase
    .from("daftar_harga")
    .select(COLUMNS)
    .order("Jenis Sampah", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(toApiShape);
};

const createDaftarHarga = async (payload) => {
  const { data, error } = await supabase
    .from("daftar_harga")
    .insert([toDbShape(payload)])
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return toApiShape(data);
};

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

const deleteDaftarHarga = async (id) => {
  const { error } = await supabase.from("daftar_harga").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
};

// Looks up the current price for a waste type by name so the caller can snapshot it
// onto the transaksi row (historical transactions must not shift if the price changes later).
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
