"use client";


/**
 * @param {{
 *  currentPage: number,
 *  totalPages: number,
 *  onPageChange?: (page: number) => void,
 * }} props
 */
const Pagination = ({ currentPage, totalPages, onPageChange = () => {} }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleNextClick = () => {
    if (currentPage === totalPages) {
      onPageChange(1);
    } else {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="pagination-container">
      <button
        type="button"
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="pagination-btn"
        onClick={handleNextClick}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;