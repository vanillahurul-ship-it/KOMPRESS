/**
 * Dropdown Status Transaksi
 *
 * Dropdown berbentuk label berwarna yang memungkinkan status setoran diubah
 * langsung dari tabel. Warnanya menyesuaikan status yang sedang terpilih,
 * memakai daftar warna yang sama dengan komponen StatusBadge.
 *
 * @param {object} props
 * @param {string} props.status - Status yang sedang berlaku.
 * @param {Function} props.onChange - Dipanggil dengan status yang baru dipilih.
 */

import { TRANSAKSI_STATUS, STATUS_BADGE_STYLE } from "../../constants/statusOptions";

// Tanda panah bawaan dropdown tampil berbeda-beda di setiap peramban dan tidak
// serasi dengan bentuk lonjong komponen ini. Karena itu tanda panah bawaan
// dimatikan lewat properti appearance, lalu diganti gambar panah buatan sendiri
// yang dipasang sebagai latar belakang.
const CHEVRON =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">' +
  '<path d="M2 3.5L5 6.5L8 3.5" stroke="%23374151" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export default function StatusDropdown({ status, onChange }) {
  const style = STATUS_BADGE_STYLE[status] || { bg: "#E5E7EB", text: "#374151" };

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Ubah status setoran"
      style={{
        WebkitAppearance: "none",
        MozAppearance: "none",
        appearance: "none",
        border: "none",
        borderRadius: 999,
        padding: "8px 32px 8px 14px",
        fontSize: 12,
        fontWeight: 700,
        background: `${style.bg} url('${CHEVRON}') no-repeat right 14px center`,
        backgroundSize: "10px",
        color: style.text,
        cursor: "pointer",
        lineHeight: 1.2,
      }}
    >
      {TRANSAKSI_STATUS.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}
