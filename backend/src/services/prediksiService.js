const { spawn } = require("child_process");
const path = require("path");
const transaksiService = require("./transaksiService");
const AppError = require("../utils/AppError");

const PYTHON_BIN = process.env.PYTHON_PATH || "python";
const SCRIPT_PATH = path.join(__dirname, "..", "python", "ml", "predict.py");

const getTrenRows = () => transaksiService.getPendapatanBulanan();

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

    child.on("error", (err) => {
      reject(new AppError(`Gagal menjalankan proses prediksi Python: ${err.message}`, 500));
    });

    child.on("close", () => {
      try {
        const parsed = JSON.parse(stdout.trim().split("\n").pop());
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

    child.stdin.write(JSON.stringify({ rows, horizon }));
    child.stdin.end();
  });

const runPrediksi = async (horizon) => {
  const rows = await getTrenRows();
  return runPredictScript(rows, horizon);
};

module.exports = { runPrediksi };
