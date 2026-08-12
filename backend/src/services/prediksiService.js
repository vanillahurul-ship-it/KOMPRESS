/**
 * Service Prediksi
 *
 * Menjembatani backend Node.js dengan skrip Python yang menjalankan model
 * Random Forest Regression.
 *
 * Cara kerjanya: skrip predict.py dijalankan sebagai proses anak (child
 * process). Data historis dikirim ke skrip melalui stdin dalam bentuk JSON,
 * lalu hasil prediksinya dibaca kembali dari stdout. Pendekatan ini dipilih
 * agar tidak perlu menulis data sementara ke berkas dan prosesnya tetap
 * terisolasi dari proses utama server.
 */

const { spawn } = require("child_process");
const path = require("path");
const transaksiService = require("./transaksiService");
const AppError = require("../utils/AppError");

// Perintah Python dapat diatur lewat .env, berguna bila di server memakai
// python3 atau berada di dalam virtual environment
const PYTHON_BIN = process.env.PYTHON_PATH || "python";
const SCRIPT_PATH = path.join(__dirname, "..", "python", "ml", "predict.py");

/** Mengambil data historis pendapatan dan berat sampah per bulan. */
const getTrenRows = () => transaksiService.getPendapatanBulanan();

/**
 * Menjalankan skrip predict.py dan menunggu hasilnya.
 *
 * @param {Array<object>} rows - Data historis bulanan.
 * @param {number} horizon - Jumlah bulan yang diprediksi ke depan.
 * @returns {Promise<object>} Hasil prediksi dari skrip Python.
 * @throws {AppError} 500 bila Python tidak dapat dijalankan atau keluarannya
 *                    tidak dapat dibaca; 422 bila skrip menolak memproses
 *                    data, misalnya karena riwayat transaksi terlalu sedikit.
 */
const runPredictScript = (rows, horizon) =>
  new Promise((resolve, reject) => {
    const child = spawn(PYTHON_BIN, [SCRIPT_PATH]);

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    // Terpicu bila perintah Python sendiri tidak ditemukan atau gagal dijalankan
    child.on("error", (err) => {
      reject(new AppError(`Gagal menjalankan proses prediksi Python: ${err.message}`, 500));
    });

    child.on("close", () => {
      try {
        // Hanya baris terakhir yang berisi JSON hasil prediksi; baris sebelumnya
        // bisa berupa peringatan dari pustaka Python yang tidak perlu diproses.
        const parsed = JSON.parse(stdout.trim().split("\n").pop());

        // Skrip melaporkan penolakan yang wajar (data kurang) lewat field error
        if (parsed.error) {
          return reject(new AppError(parsed.error, 422));
        }
        return resolve(parsed);
      } catch (_err) {
        return reject(
          new AppError(`Proses prediksi gagal: ${stderr || "output tidak valid"}`, 500)
        );
      }
    });

    // Kirim data lalu tutup stdin sebagai tanda bahwa kiriman sudah selesai
    child.stdin.write(JSON.stringify({ rows, horizon }));
    child.stdin.end();
  });

/**
 * Menjalankan prediksi volume dan pendapatan sampah.
 *
 * @param {number} horizon - Jumlah bulan ke depan (6 atau 12).
 * @returns {Promise<object>} Hasil prediksi beserta metrik akurasinya.
 */
const runPrediksi = async (horizon) => {
  const rows = await getTrenRows();
  return runPredictScript(rows, horizon);
};

module.exports = { runPrediksi };
