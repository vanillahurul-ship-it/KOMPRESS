const authService = require("../services/authService");

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
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};