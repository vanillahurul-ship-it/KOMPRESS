// Centralized error handler — mounted last in app.js. Controllers wrapped in
// asyncHandler (or that call next(err)) all end up here instead of repeating
// try/catch + res.status(...).json(...) in every controller function.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err.message);

  const status = err.status || 500;
  const message = status === 500 ? "Terjadi kesalahan pada server" : err.message;

  return res.status(status).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
