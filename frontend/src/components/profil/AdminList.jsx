import eyeIcon from "../../assets/icons/login/matabuka.svg";
import EmptyState from "../shared/EmptyState";
import LoadingSkeleton from "../shared/LoadingSkeleton";
import "../shared/Card.css";
import "./AdminList.css";

export default function AdminList({ admins, loading, onView }) {
  return (
    <section className="shared-card" style={{ padding: "24px 0" }}>
      <h2 className="shared-card-title" style={{ padding: "0 28px" }}>Manajemen Admin</h2>

      <div style={{ marginTop: 12 }}>
        {loading ? (
          <LoadingSkeleton rows={2} />
        ) : admins.length === 0 ? (
          <EmptyState title="Belum ada admin terdaftar" />
        ) : (
          admins.map((admin) => (
            <div key={admin.id} className="admin-list-row">
              <span>{admin.nama}</span>
              <button type="button" className="shared-icon-button" onClick={() => onView(admin)} aria-label="Lihat detail admin">
                <img src={eyeIcon} alt="" />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
