/**
 * Service Otentikasi
 *
 * Menghubungkan aplikasi dengan Supabase Auth untuk proses masuk (login).
 * Kata sandi tidak pernah disimpan maupun diperiksa sendiri oleh aplikasi
 * ini; seluruhnya ditangani Supabase.
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

/**
 * Memeriksa email dan kata sandi ke Supabase Auth.
 *
 * Fungsi ini sengaja membuat klien Supabase sementara, terpisah dari klien
 * global di config/supabase.js. Alasannya, proses masuk membuat pustaka
 * Supabase mengganti header koneksi menjadi token milik pengguna tersebut.
 * Bila memakai klien global, seluruh service lain akan ikut terpengaruh dan
 * kehilangan hak akses service role.
 *
 * Opsi persistSession dan autoRefreshToken dimatikan karena backend tidak
 * perlu menyimpan sesi; token cukup dikembalikan ke frontend untuk disimpan
 * di sana.
 *
 * @param {string} email - Email admin.
 * @param {string} password - Kata sandi admin.
 * @returns {Promise<object>} Data pengguna beserta sesi (berisi access_token).
 * @throws {Error} Bila email atau kata sandi tidak cocok.
 */
const login = async (email, password) => {
  const authClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  login,
};
