/**
 * Controller Otentikasi
 *
 * Menangani proses masuk (login) admin. Controller ini hanya bertugas
 * memeriksa kelengkapan input dan menyusun response; pemeriksaan email dan
 * kata sandi sepenuhnya diserahkan ke Supabase Auth melalui authService.
 *
 * Berbeda dengan controller lain yang memakai asyncHandler, di sini masih
 * dipakai try/catch karena kegagalan masuk harus dijawab dengan kode 401
 * (kredensial salah), bukan kode bawaan dari errorHandler.
 */

const authService = require("../services/authService");

/**
 * POST /api/auth/login
 *
 * Body: { email, password }
 *
 * Bila berhasil, mengembalikan data pengguna beserta access_token yang harus
 * disimpan frontend dan dikirim ulang pada setiap permintaan berikutnya.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    const data = await authService.login(email, password);

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      access_token: data.session.access_token,
    });

  } catch (error) {
    // Kegagalan masuk selalu dianggap kesalahan kredensial (401)
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
