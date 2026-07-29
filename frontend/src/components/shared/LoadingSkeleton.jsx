import "./LoadingSkeleton.css";

export default function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="shared-skeleton-list" aria-label="Memuat data">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="shared-skeleton-row" />
      ))}
    </div>
  );
}
