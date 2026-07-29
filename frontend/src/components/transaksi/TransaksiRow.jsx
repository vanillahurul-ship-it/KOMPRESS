import editIcon from "../../assets/icons/datanasabah/editnasabah.svg";
import deleteIcon from "../../assets/icons/datanasabah/hapusnasabah.svg";
import StatusDropdown from "./StatusDropdown";
import { formatCurrency, formatNumber } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

export default function TransaksiRow({ data, onStatusChange, onEdit, onDelete, style }) {
  return (
    <div className="shared-table-grid shared-table-row" style={style}>
      <span>{data.nama_nasabah || "-"}</span>
      <span>{formatDate(data.tanggal)}</span>
      <span>{data.jenis_sampah || "-"}</span>
      <span>{formatNumber(data.berat_kg)} Kg</span>
      <span style={{ color: "var(--admin-rupiah, #5A8841)", fontWeight: 600 }}>
        {formatCurrency(data.total)}
      </span>
      <span>
        <StatusDropdown status={data.status} onChange={(status) => onStatusChange(data, status)} />
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
