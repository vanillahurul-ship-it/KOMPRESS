/**
 * Baris Tabel Nasabah
 *
 * Menampilkan data satu nasabah beserta tombol ubah dan hapus.
 *
 * Tombol di sini tidak menjalankan tindakannya sendiri, melainkan meneruskan
 * data nasabah ke komponen induk. Dengan begitu pengelolaan modal dan dialog
 * konfirmasi tetap terpusat di halaman.
 *
 * @param {object} props
 * @param {object} props.data - Data satu nasabah.
 * @param {Function} props.onEdit - Dipanggil saat tombol ubah ditekan.
 * @param {Function} props.onDelete - Dipanggil saat tombol hapus ditekan.
 * @param {object} props.style - Pengaturan lebar kolom dari komponen tabel.
 */

import editIcon from "../../assets/icons/datanasabah/editnasabah.svg";
import deleteIcon from "../../assets/icons/datanasabah/hapusnasabah.svg";
import StatusBadge from "../shared/StatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";

export default function NasabahRow({ data, onEdit, onDelete, style }) {
  return (
    <div className="shared-table-grid shared-table-row" style={style}>
      <span>{data.nama}</span>
      <span>{data.alamat}</span>
      <span>{data.no_rekening}</span>
      {/* Saldo diberi warna dan huruf tebal agar lebih mudah ditemukan mata */}
      <span style={{ color: "var(--admin-rupiah, #5A8841)", fontWeight: 600 }}>
        {formatCurrency(data.saldo)}
      </span>
      <span>
        <StatusBadge status={data.status} />
      </span>
      <span className="shared-action-buttons">
        <button type="button" className="shared-icon-button" onClick={() => onEdit(data)} aria-label="Edit">
          <img src={editIcon} alt="" />
        </button>
        <button type="button" className="shared-icon-button" onClick={() => onDelete(data)} aria-label="Hapus">
          <img src={deleteIcon} alt="" />
        </button>
      </span>
    </div>
  );
}
