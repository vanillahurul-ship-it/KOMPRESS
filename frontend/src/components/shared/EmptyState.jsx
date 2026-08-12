/**
 * Komponen Tampilan Data Kosong
 *
 * Menampilkan keterangan ketika tidak ada data yang dapat ditampilkan, agar
 * halaman tidak terlihat kosong begitu saja dan pengguna memahami keadaannya.
 *
 * @param {object} props
 * @param {string} [props.title="Belum ada data"] - Keterangan utama.
 * @param {string} [props.description] - Penjelasan tambahan, boleh dikosongkan.
 */

import "./EmptyState.css";

export default function EmptyState({ title = "Belum ada data", description }) {
  return (
    <div className="shared-empty-state">
      <p className="shared-empty-title">{title}</p>
      {description && <p className="shared-empty-description">{description}</p>}
    </div>
  );
}
