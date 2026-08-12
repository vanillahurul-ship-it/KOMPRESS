/**
 * Middleware Otentikasi
 *
 * Menjaga seluruh route yang didaftarkan setelahnya di app.js. Setiap
 * permintaan wajib menyertakan header:
 *
 *   Authorization: Bearer <token_akses_supabase>
 *
 * Token tersebut diperoleh frontend saat berhasil masuk melalui
 * POST /api/auth/login, lalu diverifikasi ulang di sini ke Supabase Auth.
 *
 * Bila token valid, data pengguna disimpan pada `req.user` sehingga bisa
 * dipakai controller di belakangnya. Bila tidak, permintaan langsung ditolak
 * dengan kode 401 dan tidak diteruskan.
 */

const supabase = require("../config/supabase");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  // Ambil token setelah kata "Bearer "; abaikan bila formatnya tidak sesuai
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token otentikasi tidak ditemukan",
    });
  }

  // Verifikasi token ke Supabase; token palsu atau kedaluwarsa akan gagal di sini
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({
      success: false,
      message: "Sesi tidak valid atau telah berakhir, silakan masuk kembali",
    });
  }

  // Simpan data pengguna agar dapat diakses controller berikutnya
  req.user = data.user;
  next();
};

module.exports = authMiddleware;
