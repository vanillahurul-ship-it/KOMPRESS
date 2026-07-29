import { NASABAH_STATUS } from "../../constants/statusOptions";

// Sama pola markup dengan YearFilter (components/laporan/YearFilter.jsx) supaya
// konsisten dengan dropdown filter di halaman Laporan & Transaksi.
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
