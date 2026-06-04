import "./CataloguePagination.css";

export default function CataloguePagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        aria-label="Page précédente"
      >
        ←
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`pagination__btn ${currentPage === page ? "pagination__btn--active" : ""}`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
      >
        →
      </button>
    </div>
  );
}