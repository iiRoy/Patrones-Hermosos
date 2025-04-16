'use client';

import React from 'react';

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  variant?: 'primary' | 'secondary-shade' | 'accent';
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 11,
  variant = 'primary',
  onPageChange = () => {},
}) => {
  const getPageClass = (page: number) => {
    const isActive = page === currentPage;
    return `page ${isActive ? `active active-${variant}` : ''}`;
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const pagesToShow = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push(-1); // dots

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) pages.push(-1); // dots
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className='pagination'>
      <a
        href='#'
        className='prev'
        onClick={(e) => {
          e.preventDefault();
          if (currentPage > 1) onPageChange(currentPage - 1);
        }}
      >
        <span className={`double-arrow double-arrow-${variant}`}>«</span> Previous
      </a>

      {pagesToShow().map((page, idx) =>
        page === -1 ? (
          <span className='dots' key={`dots-${idx}`}>
            ...
          </span>
        ) : (
          <a
            href='#'
            key={page}
            className={getPageClass(page)}
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(page);
            }}
          >
            {page}
          </a>
        ),
      )}

      <a
        href='#'
        className='next'
        onClick={(e) => {
          e.preventDefault();
          if (currentPage < totalPages) onPageChange(currentPage + 1);
        }}
      >
        Next <span className={`double-arrow double-arrow-${variant}`}>»</span>
      </a>
    </div>
  );
};

export default Pagination;
