/**
 * Penyaring Status Nasabah
 *
 * Dropdown untuk menyaring nasabah berdasarkan status keaktifannya.
 *
 * Susunan dan penamaan kelasnya sengaja disamakan dengan YearFilter di
 * components/laporan/YearFilter.jsx, agar seluruh dropdown penyaring dalam
 * aplikasi ini tampil seragam.
 *
 * @param {object} props
 * @param {string} props.value - Status terpilih; teks kosong berarti semua.
 * @param {Function} props.onChange - Dipanggil dengan status yang dipilih.
 */

import { NASABAH_STATUS } from "../../constants/statusOptions";

export default function StatusFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="shared-form-select"
      style={{ maxWidth: 160 }}
      aria-label="Filter Status"
    >
      <option value="">Semua</option>
      {NASABAH_STATUS.map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  );
}
