import "./Pagination.css";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="shared-pagination">
      <button
        type="button"
        className="shared-pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Halaman sebelumnya"
      >
        &lsaquo;
      </button>

      <span className="shared-pagination-current">{page}</span>

      <button
        type="button"
        className="shared-pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Halaman berikutnya"
      >
        &rsaquo;
      </button>
    </div>
  );
}
