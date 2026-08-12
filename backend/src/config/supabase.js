/**
 * Koneksi Supabase (Sisi Backend)
 *
 * Membuat satu instance klien Supabase yang dipakai bersama oleh seluruh
 * service. Karena dibuat sekali di sini, koneksi tidak perlu dibuat ulang
 * setiap kali ada permintaan masuk.
 *
 * Klien ini memakai SERVICE ROLE KEY, sehingga memiliki akses penuh ke basis
 * data dan melewati aturan RLS (Row Level Security). Kunci tersebut hanya
 * boleh dipakai di backend dan tidak boleh dikirim ke browser. Pembatasan
 * akses pengguna tetap dilakukan, yaitu melalui authMiddleware.
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Gagalkan aplikasi sejak awal bila konfigurasi wajib belum diisi,
// supaya kesalahan konfigurasi ketahuan saat server dinyalakan.
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diset di .env");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;
