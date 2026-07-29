"""
Random Forest Regression prediction for MACODES Bank Sampah monthly revenue.

Reads a JSON payload from stdin:
  {
    "rows": [{"bulan": "2026-01-01", "tahun": 2026, "bulan_num": 1,
               "jumlah_transaksi": 12, "total_berat": 45.2, "total_pendapatan": 350000}, ...],
    "horizon": 6
  }
Writes a JSON result to stdout:
  {
    "predictions": [{"bulan_num": 8, "tahun": 2026, "prediksi_pendapatan": 412000}, ...],
    "total_prediksi": ..., "rata_rata_pendapatan": ...,
    "mae": ..., "rmse": ..., "r2": ..., "warning": "..." (optional)
  }
On failure, writes {"error": "..."} to stdout and exits with status 1.

The model is retrained only when the underlying data has changed (row count or
latest month), using a fingerprint cached alongside the joblib model file.
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

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
MODEL_PATH = MODELS_DIR / "rf_model.joblib"
META_PATH = MODELS_DIR / "metadata.json"

# Raw bulan_num (1-12) doesn't extrapolate: a tree only ever learns thresholds within
# the training range, so any future bulan_num beyond that range (e.g. all of 8-12 when
# training only saw 1-7) lands on the same side of every split and becomes indistinguishable
# from its neighbors — this is what flattened the prediction curve. Encoding the month as a
# point on the unit circle (sin/cos) keeps future months inside the same value range the
# model already learned splits on, so it can tell them apart again.
FEATURES = ["bulan_sin", "bulan_cos", "tahun", "jumlah_transaksi", "total_berat"]
TARGET = "total_pendapatan"
MIN_MONTHS_REQUIRED = 3
MODEL_VERSION = "v2-cyclical-month"


def fail(message):
    print(json.dumps({"error": message}))
    sys.exit(1)


def with_cyclical_month(frame):
    frame = frame.copy()
    frame["bulan_sin"] = np.sin(2 * np.pi * frame["bulan_num"] / 12)
    frame["bulan_cos"] = np.cos(2 * np.pi * frame["bulan_num"] / 12)
    return frame


def fingerprint(rows):
    raw = json.dumps(
        [MODEL_VERSION]
        + [[r["tahun"], r["bulan_num"], r["jumlah_transaksi"], r["total_berat"], r["total_pendapatan"]] for r in rows],
        sort_keys=True,
    )
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def load_cached_model(current_fingerprint):
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
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    META_PATH.write_text(json.dumps({"fingerprint": current_fingerprint}))


def next_month(tahun, bulan_num):
    if bulan_num == 12:
        return tahun + 1, 1
    return tahun, bulan_num + 1


def main():
    # utf-8-sig strips a leading BOM if present (some shells/pipes prepend one to piped text);
    # it behaves identically to plain utf-8 when no BOM exists.
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

    df = pd.DataFrame(rows).sort_values(["tahun", "bulan_num"]).reset_index(drop=True)
    df = with_cyclical_month(df)
    X = df[FEATURES]
    y = df[TARGET]

    current_fingerprint = fingerprint(rows)
    model = load_cached_model(current_fingerprint)

    warning = None
    n = len(df)

    if model is None:
        model = RandomForestRegressor(n_estimators=200, random_state=42)

        if n >= 5:
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
        else:
            # Too few months for a meaningful held-out split; train on everything and
            # report in-sample metrics instead — still functional, just less rigorous.
            warning = (
                "Data historis masih sedikit (<5 bulan), evaluasi model menggunakan "
                "seluruh data training (in-sample), bukan data uji terpisah."
            )
            model.fit(X, y)
            y_pred = model.predict(X)
            y_test = y

        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        r2 = float(r2_score(y_test, y_pred)) if len(y_test) > 1 else 0.0

        bundle = {"model": model, "mae": mae, "rmse": rmse, "r2": r2}
        save_model(bundle, current_fingerprint)
    else:
        bundle = model

    rf_model = bundle["model"]

    # Future months' jumlah_transaksi / total_berat are unknown. A single frozen
    # average fed into every future month collapses the RF's inputs to one point,
    # which flattens the whole prediction curve — so instead extrapolate a linear
    # trend over the recent months and let each future month get its own proxied
    # value, tracking the actual growth/decline pattern in the data.
    recent = df.tail(min(6, n))
    recent_idx = np.arange(len(recent))
    jumlah_slope, jumlah_intercept = np.polyfit(recent_idx, recent["jumlah_transaksi"], 1)
    berat_slope, berat_intercept = np.polyfit(recent_idx, recent["total_berat"], 1)
    last_recent_idx = len(recent) - 1

    last_tahun, last_bulan = int(df.iloc[-1]["tahun"]), int(df.iloc[-1]["bulan_num"])
    predictions = []
    for step in range(1, horizon + 1):
        last_tahun, last_bulan = next_month(last_tahun, last_bulan)
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
    except Exception as exc:  # noqa: BLE001 - surface any failure as a clean JSON error to Node
        fail(str(exc))
