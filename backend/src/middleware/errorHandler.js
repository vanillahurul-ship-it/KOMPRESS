/**
 * Penanganan Error Terpusat
 *
 * Middleware ini dipasang paling akhir di app.js. Seluruh error dari
 * controller yang dibungkus asyncHandler (atau yang memanggil next(err))
 * akan bermuara ke sini, sehingga tidak perlu ada blok try/catch berulang
 * di setiap controller.
 *
 * Error yang berasal dari AppError membawa kode status dan pesannya sendiri.
 * Error lain dianggap kesalahan tak terduga: pesan aslinya hanya dicatat di
 * log server, sedangkan pengguna menerima pesan umum agar detail internal
 * sistem tidak bocor.
 *
 * Parameter `next` wajib tetap ditulis walaupun tidak dipakai, karena Express
 * mengenali middleware error dari jumlah parameternya yang berjumlah empat.
 */

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
