/**
 * Baris Jenis Sampah
 *
 * Menampilkan nama jenis sampah beserta harga belinya dari nasabah, dilengkapi
 * tombol ubah dan hapus.
 *
 * Harga yang ditampilkan adalah harga ke nasabah, bukan harga ke DLH, sebab
 * angka itulah yang dipakai saat mencatat setoran.
 *
 * @param {object} props
 * @param {object} props.data - Data satu jenis sampah.
 * @param {Function} props.onEdit - Dipanggil saat tombol ubah ditekan.
 * @param {Function} props.onDelete - Dipanggil saat tombol hapus ditekan.
 */

import editIcon from "../../assets/icons/datanasabah/editnasabah.svg";
import deleteIcon from "../../assets/icons/datanasabah/hapusnasabah.svg";
import { formatCurrency } from "../../utils/formatCurrency";

export default function JenisSampahRow({ data, onEdit, onDelete }) {
  return (
    <div className="jenis-sampah-row">
      <div className="jenis-sampah-row-info">
        <p className="jenis-sampah-row-nama">{data.nama}</p>
        <p className="jenis-sampah-row-harga">
          {formatCurrency(data.harga_per_kg)} / Kg
        </p>
      </div>
      <div className="shared-action-buttons">
        <button type="button" className="shared-icon-button" onClick={() => onEdit(data)} aria-label="Edit">
          <img src={editIcon} alt="" />
        </button>
        <button type="button" className="shared-icon-button" onClick={() => onDelete(data)} aria-label="Hapus">
          <img src={deleteIcon} alt="" />
        </button>
      </div>
    </div>
  );
}
