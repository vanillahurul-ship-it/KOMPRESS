"""
Skrip Prediksi Pendapatan dengan Random Forest Regression

Skrip ini dijalankan oleh backend Node.js sebagai proses terpisah
(lihat prediksiService.js). Alur komunikasinya:

    Masukan  : JSON melalui stdin, berbentuk { "rows": [...], "horizon": 6|12 }
    Keluaran : JSON melalui stdout, berisi hasil prediksi beserta metrik akurasi
    Kegagalan: JSON berisi field "error" pada stdout, lalu keluar dengan kode 1

Ringkasan proses:
    1. Membaca data historis transaksi bulanan dari stdin.
    2. Melatih model Random Forest, atau memakai kembali model tersimpan bila
       data historisnya belum berubah.
    3. Menghitung metrik akurasi model (MAE, RMSE, dan R²).
    4. Memprediksi pendapatan untuk beberapa bulan ke depan.
"""

import sys
import json
import hashlib
from pathlib import Path

import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Lokasi penyimpanan model hasil pelatihan beserta keterangannya
MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
MODEL_PATH = MODELS_DIR / "rf_model.joblib"
META_PATH = MODELS_DIR / "metadata.json"

# Daftar fitur yang dipakai model untuk memprediksi pendapatan.
#
# Nomor bulan (1-12) sengaja TIDAK dipakai secara langsung. Random Forest
# bekerja dengan mencari ambang batas pemisah pada rentang data pelatihan
# saja. Bila model hanya pernah melihat bulan 1 sampai 7, maka seluruh bulan
# 8 sampai 12 akan jatuh pada sisi pemisah yang sama dan dianggap serupa,
# sehingga grafik prediksi menjadi datar.
#
# Solusinya, bulan diubah menjadi titik pada lingkaran memakai fungsi sinus
# dan kosinus. Dengan cara ini nilai bulan selalu berada dalam rentang -1
# sampai 1 yang sudah dikenali model, sekaligus mencerminkan sifat bulan yang
# berulang setiap tahun (Desember bersebelahan dengan Januari).
FEATURES = ["bulan_sin", "bulan_cos", "tahun", "jumlah_transaksi", "total_berat"]

# Kolom yang ingin diprediksi
TARGET = "total_pendapatan"

# Jumlah bulan data minimal agar prediksi masih layak dijalankan
MIN_MONTHS_REQUIRED = 3

# Penanda versi model. Bila cara pengolahan fitur diubah, ubah juga nilai ini
# supaya model lama yang tersimpan tidak ikut terpakai kembali.
MODEL_VERSION = "v2-cyclical-month"


def fail(message):
    """Menghentikan skrip dan melaporkan kegagalan ke Node.js dalam bentuk JSON.

    Args:
        message (str): Penjelasan kegagalan yang akan ditampilkan ke pengguna.
    """
    print(json.dumps({"error": message}))
    sys.exit(1)


def with_cyclical_month(frame):
    """Menambahkan kolom bulan_sin dan bulan_cos ke dalam tabel data.

    Bulan diubah menjadi koordinat pada lingkaran satuan agar model dapat
    mengenali pola musiman sekaligus tetap dapat memprediksi bulan-bulan yang
    belum pernah muncul pada data pelatihan.

    Args:
        frame (pandas.DataFrame): Tabel yang memiliki kolom bulan_num.

    Returns:
        pandas.DataFrame: Salinan tabel beserta dua kolom baru.
    """
    frame = frame.copy()
    frame["bulan_sin"] = np.sin(2 * np.pi * frame["bulan_num"] / 12)
    frame["bulan_cos"] = np.cos(2 * np.pi * frame["bulan_num"] / 12)
    return frame


def fingerprint(rows):
    """Membuat sidik jari (hash) dari data historis.

    Sidik jari dipakai untuk mengetahui apakah data berubah sejak pelatihan
    terakhir. Versi model ikut disertakan supaya perubahan cara pengolahan
    fitur juga menghasilkan sidik jari yang berbeda.

    Args:
        rows (list): Data historis bulanan.

    Returns:
        str: Nilai hash SHA-256 dalam bentuk heksadesimal.
    """
    raw = json.dumps(
        [MODEL_VERSION]
        + [[r["tahun"], r["bulan_num"], r["jumlah_transaksi"], r["total_berat"], r["total_pendapatan"]] for r in rows],
        sort_keys=True,
    )
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def load_cached_model(current_fingerprint):
    """Memuat model tersimpan bila masih sesuai dengan data saat ini.

    Semua bentuk kegagalan (berkas belum ada, isinya rusak, atau sidik jarinya
    berbeda) diperlakukan sama, yaitu mengembalikan None sehingga model dilatih
    ulang. Cara ini dipilih agar berkas model yang bermasalah tidak sampai
    menggagalkan permintaan prediksi.

    Args:
        current_fingerprint (str): Sidik jari data yang sedang diproses.

    Returns:
        dict | None: Model beserta metriknya, atau None bila harus dilatih ulang.
    """
    if not MODEL_PATH.exists() or not META_PATH.exists():
        return None
    try:
        meta = json.loads(META_PATH.read_text())
    except (json.JSONDecodeError, OSError):
        return None
    if meta.get("fingerprint") != current_fingerprint:
        return None
    try:
        return joblib.load(MODEL_PATH)
    except Exception:
        return None


def save_model(model, current_fingerprint):
    """Menyimpan model beserta sidik jari datanya ke dalam berkas.

    Args:
        model (dict): Model beserta metrik akurasinya.
        current_fingerprint (str): Sidik jari data yang dipakai saat pelatihan.
    """
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    META_PATH.write_text(json.dumps({"fingerprint": current_fingerprint}))


def next_month(tahun, bulan_num):
    """Menghitung bulan berikutnya beserta pergantian tahunnya.

    Args:
        tahun (int): Tahun saat ini.
        bulan_num (int): Nomor bulan saat ini (1-12).

    Returns:
        tuple[int, int]: Pasangan (tahun, bulan) berikutnya.
    """
    if bulan_num == 12:
        return tahun + 1, 1
    return tahun, bulan_num + 1


def main():
    """Menjalankan keseluruhan alur prediksi, dari membaca masukan hingga
    mencetak hasilnya."""

    # Memakai utf-8-sig agar penanda BOM di awal teks ikut dibuang bila ada.
    # Sebagian shell menyisipkan penanda tersebut saat mengalirkan data.
    # Bila tidak ada BOM, perilakunya sama persis dengan utf-8 biasa.
    raw_input = sys.stdin.buffer.read().decode("utf-8-sig")
    payload = json.loads(raw_input)
    rows = payload.get("rows", [])
    horizon = int(payload.get("horizon", 6))

    if horizon not in (6, 12):
        fail("horizon harus 6 atau 12 bulan")

    if len(rows) < MIN_MONTHS_REQUIRED:
        fail(
            f"Data histori transaksi belum cukup untuk menjalankan prediksi "
            f"(minimal {MIN_MONTHS_REQUIRED} bulan data, saat ini {len(rows)} bulan)."
        )

    # --- Menyiapkan data pelatihan -------------------------------------
    # Data diurutkan secara kronologis karena urutan waktunya dipakai saat
    # menghitung tren pada tahap prediksi di bawah.
    df = pd.DataFrame(rows).sort_values(["tahun", "bulan_num"]).reset_index(drop=True)
    df = with_cyclical_month(df)
    X = df[FEATURES]   # fitur masukan
    y = df[TARGET]     # nilai yang ingin diprediksi

    # Bila data historis belum berubah, model sebelumnya dipakai kembali
    # supaya tidak perlu melatih ulang setiap kali ada permintaan masuk.
    current_fingerprint = fingerprint(rows)
    model = load_cached_model(current_fingerprint)

    warning = None
    n = len(df)

    if model is None:
        # Random Forest Regression: 200 pohon keputusan yang hasilnya dirata-rata.
        # random_state disetel tetap agar hasil prediksi selalu sama bila
        # dijalankan ulang dengan data yang sama.
        model = RandomForestRegressor(n_estimators=200, random_state=42)

        if n >= 5:
            # Data dibagi menjadi 80% untuk pelatihan dan 20% untuk pengujian,
            # supaya metrik akurasi dihitung dari data yang belum pernah
            # dilihat model.
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
        else:
            # Data terlalu sedikit untuk dibagi. Model dilatih memakai seluruh
            # data dan metriknya dihitung dari data yang sama. Hasilnya tetap
            # dapat dipakai, hanya saja kurang objektif, sehingga pengguna
            # diberi tahu lewat pesan peringatan.
            warning = (
                "Data historis masih sedikit (<5 bulan), evaluasi model menggunakan "
                "seluruh data training (in-sample), bukan data uji terpisah."
            )
            model.fit(X, y)
            y_pred = model.predict(X)
            y_test = y

        # Metrik akurasi model:
        #   MAE  - rata-rata selisih absolut antara prediksi dan kenyataan
        #   RMSE - akar rata-rata kuadrat selisih; lebih peka pada kesalahan besar
        #   R²   - seberapa besar keragaman data yang berhasil dijelaskan model
        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))

        # R² memerlukan minimal dua titik data; dengan satu titik nilainya
        # tidak bermakna sehingga cukup diisi 0.
        r2 = float(r2_score(y_test, y_pred)) if len(y_test) > 1 else 0.0

        bundle = {"model": model, "mae": mae, "rmse": rmse, "r2": r2}
        save_model(bundle, current_fingerprint)
    else:
        bundle = model

    rf_model = bundle["model"]

    # --- Memperkirakan nilai fitur untuk bulan-bulan mendatang ----------
    # Jumlah transaksi dan total berat pada bulan yang belum terjadi tentu
    # belum diketahui, padahal keduanya termasuk fitur masukan model.
    #
    # Bila seluruh bulan mendatang diisi satu nilai rata-rata yang sama,
    # masukan model menjadi seragam dan grafik prediksi ikut mendatar. Karena
    # itu dipakai garis tren linear dari beberapa bulan terakhir, sehingga
    # setiap bulan mendatang memperoleh perkiraan nilainya sendiri yang
    # mengikuti pola kenaikan atau penurunan data sebenarnya.
    recent = df.tail(min(6, n))
    recent_idx = np.arange(len(recent))

    # polyfit berderajat 1 menghasilkan kemiringan dan titik potong garis tren
    jumlah_slope, jumlah_intercept = np.polyfit(recent_idx, recent["jumlah_transaksi"], 1)
    berat_slope, berat_intercept = np.polyfit(recent_idx, recent["total_berat"], 1)
    last_recent_idx = len(recent) - 1

    # --- Menghitung prediksi bulan demi bulan --------------------------
    last_tahun, last_bulan = int(df.iloc[-1]["tahun"]), int(df.iloc[-1]["bulan_num"])
    predictions = []

    for step in range(1, horizon + 1):
        last_tahun, last_bulan = next_month(last_tahun, last_bulan)

        # Perkiraan fitur untuk bulan ini berdasarkan garis tren.
        # Dibatasi minimal 0 karena jumlah transaksi maupun berat sampah
        # tidak mungkin bernilai negatif.
        proxy_idx = last_recent_idx + step
        proxy_jumlah_transaksi = max(0.0, jumlah_slope * proxy_idx + jumlah_intercept)
        proxy_total_berat = max(0.0, berat_slope * proxy_idx + berat_intercept)

        bulan_sin = np.sin(2 * np.pi * last_bulan / 12)
        bulan_cos = np.cos(2 * np.pi * last_bulan / 12)

        feature_row = pd.DataFrame(
            [[bulan_sin, bulan_cos, last_tahun, proxy_jumlah_transaksi, proxy_total_berat]], columns=FEATURES
        )
        prediksi_pendapatan = float(rf_model.predict(feature_row)[0])

        predictions.append({
            "bulan_num": last_bulan,
            "tahun": last_tahun,
            "prediksi_pendapatan": max(0.0, round(prediksi_pendapatan, 2)),
        })

    total_prediksi = sum(p["prediksi_pendapatan"] for p in predictions)

    # --- Mengirim hasil kembali ke Node.js melalui stdout ---------------
    result = {
        "predictions": predictions,
        "total_prediksi": round(total_prediksi, 2),
        "rata_rata_pendapatan": round(total_prediksi / horizon, 2),
        "mae": round(bundle["mae"], 2),
        "rmse": round(bundle["rmse"], 2),
        "r2": round(bundle["r2"], 4),
    }
    if warning:
        result["warning"] = warning

    print(json.dumps(result))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001
        # Semua kegagalan tak terduga tetap dilaporkan sebagai JSON, supaya
        # sisi Node.js selalu menerima keluaran dengan format yang dikenali.
        fail(str(exc))
