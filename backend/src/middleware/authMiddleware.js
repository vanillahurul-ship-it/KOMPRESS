const supabase = require("../config/supabase");

// Protects every route mounted after it in app.js. Expects
// `Authorization: Bearer <supabase_access_token>` (the token returned by
// POST /api/auth/login) and validates it against Supabase Auth.
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token otentikasi tidak ditemukan",
    });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({
      success: false,
      message: "Sesi tidak valid atau telah berakhir, silakan masuk kembali",
    });
  }

  req.user = data.user;
  next();
};

module.exports = authMiddleware;
