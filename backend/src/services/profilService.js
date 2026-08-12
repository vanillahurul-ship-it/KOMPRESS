/**
 * Service Profil
 *
 * Menangani dua kelompok data pada halaman Profil:
 *   1. Profil bank sampah di tabel `profil_bank_sampah`, termasuk pengelolaan
 *      berkas logo di Supabase Storage.
 *   2. Akun admin melalui Supabase Auth Admin API.
 *
 * Profil bank sampah hanya terdiri dari satu baris data dengan id tetap
 * bernilai 1, karena aplikasi ini memang digunakan oleh satu bank sampah.
 *
 * Service ini menulis banyak log ke konsol. Hal tersebut disengaja karena
 * proses unggah berkas melibatkan pihak luar (Supabase Storage) yang
 * kegagalannya sulit ditelusuri tanpa jejak log.
 */

const supabase = require("../config/supabase");
const AppError = require("../utils/AppError");

// Nama bucket penyimpanan berkas logo di Supabase Storage
const LOGO_BUCKET = "profil-assets";

// Id baris profil; selalu 1 karena hanya ada satu profil bank sampah
const PROFIL_ID = 1;

/**
 * Mengambil data profil bank sampah.
 *
 * Memakai maybeSingle, bukan single, sebab baris profil bisa saja belum ada
 * (misalnya setelah dihapus). Kondisi tersebut bukan error, cukup
 * dikembalikan sebagai null.
 *
 * @returns {Promise<object|null>} Data profil, atau null bila belum ada.
 */
const getProfil = async () => {
  console.log("[profilService] getProfil: querying profil_bank_sampah id =", PROFIL_ID);

  const { data, error } = await supabase
    .from("profil_bank_sampah")
    .select("*")
    .eq("id", PROFIL_ID)
    .maybeSingle();

  if (error) {
    console.error("[profilService] getProfil error:", error);
    throw new AppError(`Gagal mengambil data profil: ${error.message}`, 502);
  }

  console.log("[profilService] getProfil result:", data);
  return data;
};

/**
 * Mengambil kembali jalur penyimpanan dari sebuah URL publik.
 *
 * URL publik Supabase Storage berpola:
 *   .../storage/v1/object/public/<bucket>/<jalur-berkas>
 *
 * Yang tersimpan di basis data adalah URL lengkapnya, sedangkan perintah
 * penghapusan berkas memerlukan jalurnya saja, sehingga perlu dipotong.
 *
 * @param {string|null} publicUrl - URL publik logo.
 * @returns {string|null} Jalur berkas, atau null bila pola tidak dikenali.
 */
const extractStoragePath = (publicUrl) => {
  if (!publicUrl) return null;
  const marker = `/object/public/${LOGO_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
};

/**
 * Mengunggah berkas logo ke Supabase Storage.
 *
 * Nama berkas diberi penanda waktu agar tidak menimpa logo lama dan agar
 * peramban tidak menampilkan gambar versi lama dari cache.
 *
 * @param {object} file - Berkas dari multer (berisi buffer, mimetype, dan nama asli).
 * @returns {Promise<string>} URL publik logo yang baru diunggah.
 * @throws {AppError} 502 bila proses unggah gagal.
 */
const uploadLogo = async (file) => {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `logo-${Date.now()}.${fileExt}`;

  console.log(
    "[profilService] uploadLogo: uploading",
    fileName,
    "size:", file.size,
    "mimetype:", file.mimetype
  );

  const { error: uploadError } = await supabase.storage
    .from(LOGO_BUCKET)
    .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });

  if (uploadError) {
    console.error("[profilService] uploadLogo error:", uploadError);
    throw new AppError(`Gagal mengunggah logo: ${uploadError.message}`, 502);
  }

  const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(fileName);
  console.log("[profilService] uploadLogo success, publicUrl:", data.publicUrl);
  return data.publicUrl;
};

/**
 * Menghapus berkas logo lama dari Supabase Storage.
 *
 * Penghapusan ini bersifat pembersihan tambahan, bukan tahap yang wajib
 * berhasil. Saat fungsi ini dijalankan, data di basis data sudah menunjuk ke
 * logo yang baru. Jika penghapusan gagal, akibatnya hanya berupa berkas lama
 * yang tertinggal di penyimpanan, dan itu jauh lebih baik daripada
 * menggagalkan penyimpanan profil yang sudah berhasil.
 *
 * @param {string} publicUrl - URL publik logo yang ingin dihapus.
 */
const deleteLogoFile = async (publicUrl) => {
  const path = extractStoragePath(publicUrl);
  if (!path) return;

  console.log("[profilService] deleteLogoFile: removing", path);
  const { error } = await supabase.storage.from(LOGO_BUCKET).remove([path]);
  if (error) {
    console.error("[profilService] deleteLogoFile error (non-fatal, file may be orphaned):", error);
  } else {
    console.log("[profilService] deleteLogoFile success:", path);
  }
};

/**
 * Menyimpan perubahan profil bank sampah.
 *
 * Urutan langkahnya sengaja disusun sebagai berikut:
 *   1. Unggah logo baru lebih dahulu (bila ada). Bila gagal, fungsi berhenti
 *      di sini dan basis data belum tersentuh sama sekali, sehingga tidak ada
 *      data yang tersimpan setengah jadi.
 *   2. Simpan data ke basis data.
 *   3. Baru hapus logo lama setelah semuanya berhasil.
 *
 * Penyimpanan memakai upsert, bukan update, agar baris profil ikut dibuat
 * kembali apabila sebelumnya sudah terhapus lewat deleteProfil.
 *
 * @param {object} payload - Field profil yang ingin diperbarui.
 * @param {object} [file] - Berkas logo baru dari multer, bila ada.
 * @returns {Promise<object>} Data profil setelah disimpan.
 * @throws {AppError} 502 bila penyimpanan ke basis data gagal.
 */
const updateProfil = async (payload, file) => {
  console.log(
    "[profilService] updateProfil: payload =", payload,
    "file =", file ? { name: file.originalname, size: file.size, mimetype: file.mimetype } : null
  );

  const existing = await getProfil();
  const previousLogoUrl = existing?.logo_url || null;

  const updates = { ...payload, updated_at: new Date().toISOString() };

  if (file) {
    updates.logo_url = await uploadLogo(file);
  }

  const { data, error } = await supabase
    .from("profil_bank_sampah")
    .upsert({ id: PROFIL_ID, ...updates }, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    console.error("[profilService] updateProfil DB error:", error);
    throw new AppError(`Gagal menyimpan profil: ${error.message}`, 502);
  }

  console.log("[profilService] updateProfil success:", data);

  // Bersihkan logo lama hanya bila memang digantikan berkas yang berbeda
  if (file && previousLogoUrl && previousLogoUrl !== data.logo_url) {
    await deleteLogoFile(previousLogoUrl);
  }

  return data;
};

/**
 * Menghapus data profil bank sampah beserta berkas logonya.
 *
 * @returns {Promise<boolean>} Bernilai true bila berhasil.
 * @throws {AppError} 502 bila penghapusan baris gagal.
 */
const deleteProfil = async () => {
  console.log("[profilService] deleteProfil: deleting row id =", PROFIL_ID);

  // Data dibaca lebih dulu supaya URL logonya masih diketahui setelah dihapus
  const existing = await getProfil();

  const { error } = await supabase
    .from("profil_bank_sampah")
    .delete()
    .eq("id", PROFIL_ID);

  if (error) {
    console.error("[profilService] deleteProfil error:", error);
    throw new AppError(`Gagal menghapus profil: ${error.message}`, 502);
  }

  if (existing?.logo_url) {
    await deleteLogoFile(existing.logo_url);
  }

  console.log("[profilService] deleteProfil success");
  return true;
};

/**
 * Mengambil daftar akun admin dari Supabase Auth.
 *
 * Supabase Auth menyimpan kata sandi dalam bentuk terenkripsi dan tidak
 * pernah mengembalikannya melalui API mana pun, termasuk dengan service role
 * key. Oleh karena itu daftar ini hanya dapat memuat nama dan email.
 *
 * Nama diambil bertingkat dari metadata pengguna; bila keduanya kosong,
 * email dipakai sebagai penggantinya agar kolom nama tidak tampil kosong.
 *
 * @returns {Promise<Array<{id: string, nama: string, email: string}>>} Daftar admin.
 */
const listAdmins = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw new Error(error.message);

  return data.users.map((user) => ({
    id: user.id,
    nama: user.user_metadata?.name || user.user_metadata?.full_name || user.email,
    email: user.email,
  }));
};

/**
 * Menyetel ulang kata sandi seorang admin.
 *
 * Karena kata sandi lama tidak dapat dibaca dari Supabase Auth, fitur ini
 * memang dirancang sebagai penggantian kata sandi, bukan penampilan kata
 * sandi yang sedang berlaku.
 *
 * @param {string} userId - Id pengguna di Supabase Auth.
 * @param {string} password - Kata sandi baru, minimal 8 karakter.
 * @returns {Promise<{id: string}>} Id admin yang diperbarui.
 */
const resetAdminPassword = async (userId, password) => {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, { password });
  if (error) throw new Error(error.message);
  return { id: data.user.id };
};

/**
 * Mengubah nama tampilan seorang admin.
 *
 * Nama disimpan pada user_metadata karena Supabase Auth tidak menyediakan
 * kolom nama secara bawaan.
 *
 * @param {string} userId - Id pengguna di Supabase Auth.
 * @param {string} name - Nama baru.
 * @returns {Promise<{id: string, nama: string}>} Data admin setelah diperbarui.
 */
const updateAdminName = async (userId, name) => {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { name },
  });
  if (error) throw new Error(error.message);
  return { id: data.user.id, nama: data.user.user_metadata?.name || data.user.email };
};

module.exports = {
  getProfil,
  updateProfil,
  deleteProfil,
  listAdmins,
  resetAdminPassword,
  updateAdminName,
};
