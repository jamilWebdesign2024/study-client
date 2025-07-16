// components/shared/Pagination.jsx
import React from 'react';

const Pagination = ({ page, totalPages, setPage }) => {
  const getPageNumbers = () => {
    if (totalPages <= 5) return [...Array(totalPages)].map((_, i) => i + 1);

    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    ];
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="join-item btn"
        >
          Previous
        </button>

        {getPageNumbers().map((pg) => (
          <button
            key={pg}
            onClick={() => setPage(pg)}
            className={`join-item btn ${pg === page ? 'btn-active' : ''}`}
          >
            {pg}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="join-item btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
