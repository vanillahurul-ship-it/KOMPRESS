/**
 * Aturan Validasi Form
 *
 * Kumpulan aturan validasi untuk pustaka react-hook-form. Setiap nilai di
 * sini disebarkan ke dalam fungsi register, misalnya:
 *
 *   <input {...register("email", emailRule)} />
 *   <input {...register("nama", requiredRule("Nama"))} />
 *
 * Aturan dikumpulkan dalam satu berkas supaya pesan kesalahan pada seluruh
 * form seragam dan mudah diubah dari satu tempat. Pola pemeriksaan email dan
 * nomor telepon di sini juga disamakan dengan yang dipakai backend.
 */

/**
 * Aturan wajib isi dengan pesan yang menyebutkan nama field.
 *
 * @param {string} label - Nama field yang ditampilkan pada pesan kesalahan.
 * @returns {object} Aturan react-hook-form.
 */
export const requiredRule = (label) => ({
  required: `${label} wajib diisi`,
});

/** Aturan untuk field email: wajib diisi dan harus berformat email. */
export const emailRule = {
  required: "Email wajib diisi",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Format email tidak valid",
  },
};

/** Aturan untuk nomor telepon: 8-20 karakter angka dan tanda baca umum. */
export const phoneRule = {
  required: "Nomor telepon wajib diisi",
  pattern: {
    value: /^[0-9+\-\s()]{8,20}$/,
    message: "Format nomor telepon tidak valid",
  },
};

/** Aturan kata sandi: wajib diisi, minimal 8 karakter mengikuti ketentuan Supabase. */
export const passwordRule = {
  required: "Password wajib diisi",
  minLength: {
    value: 8,
    message: "Password minimal 8 karakter",
  },
};

/**
 * Aturan angka yang tidak boleh negatif, tetapi boleh bernilai nol.
 * Dipakai pada isian harga.
 *
 * @param {string} label - Nama field untuk pesan kesalahan.
 * @returns {object} Aturan react-hook-form.
 */
export const nonNegativeNumberRule = (label) => ({
  required: `${label} wajib diisi`,
  min: { value: 0, message: `${label} tidak boleh negatif` },
});

/**
 * Aturan angka yang harus lebih besar dari nol.
 * Dipakai pada isian berat sampah, sebab setoran seberat nol tidak masuk akal.
 *
 * Memakai validate, bukan min, karena nilai dari input HTML berupa teks
 * sehingga perlu diubah dulu menjadi angka sebelum dibandingkan.
 *
 * @param {string} label - Nama field untuk pesan kesalahan.
 * @returns {object} Aturan react-hook-form.
 */
export const positiveNumberRule = (label) => ({
  required: `${label} wajib diisi`,
  validate: (value) => Number(value) > 0 || `${label} harus lebih besar dari 0`,
});
