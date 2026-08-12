/**
 * Kelas Error Khusus Aplikasi
 *
 * Dipakai oleh service dan controller untuk melempar error yang sudah
 * diketahui penyebabnya, misalnya data tidak ditemukan atau input tidak valid.
 *
 * Properti `status` dibaca oleh errorHandler untuk menentukan kode status HTTP
 * yang dikirim ke frontend. Error biasa (bukan AppError) dianggap kesalahan
 * server dan otomatis memakai kode 500.
 */

class AppError extends Error {
  /**
   * @param {string} message - Pesan error yang aman ditampilkan ke pengguna.
   * @param {number} [status=400] - Kode status HTTP, misalnya 400, 404, atau 403.
   */
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

module.exports = AppError;
