import "./StatCard.css";

export default function StatCard({ icon, value, label, delta }) {
  return (
    <div className="stat-card">
      {icon && (
        <div className="stat-card-icon">
          <img src={icon} alt="" />
        </div>
      )}
      <p className="stat-card-value">{value}</p>
      <p className="stat-card-label">{label}</p>
      {delta !== undefined && delta !== null && (
        <p className={`stat-card-delta ${delta >= 0 ? "positive" : "negative"}`}>
          {delta >= 0 ? "+" : ""}
          {delta}% dari bulan lalu
        </p>
      )}
    </div>
  );
}
