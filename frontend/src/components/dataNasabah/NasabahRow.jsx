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
