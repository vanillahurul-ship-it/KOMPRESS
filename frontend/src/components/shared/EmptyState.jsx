import "./EmptyState.css";

export default function EmptyState({ title = "Belum ada data", description }) {
  return (
    <div className="shared-empty-state">
      <p className="shared-empty-title">{title}</p>
      {description && <p className="shared-empty-description">{description}</p>}
    </div>
  );
}
