/**
 * Komponen Label Status
 *
 * Menampilkan status dalam bentuk label berwarna. Dipakai pada tabel transaksi
 * maupun tabel nasabah, sebab pilihan warnanya dikumpulkan dalam satu daftar
 * yang sama.
 *
 * @param {{status: string}} props - Status yang ingin ditampilkan.
 */

import { STATUS_BADGE_STYLE } from "../../constants/statusOptions";

export default function StatusBadge({ status }) {
  // Warna abu-abu dipakai sebagai cadangan bila status tidak dikenali, supaya
  // label tetap tampil rapi alih-alih menjadi kosong
  const style = STATUS_BADGE_STYLE[status] || { bg: "#E5E7EB", text: "#374151" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: style.bg,
        color: style.text,
      }}
    >
      {status}
    </span>
  );
}
