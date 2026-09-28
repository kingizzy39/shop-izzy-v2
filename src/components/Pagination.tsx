import React from "react";
import { Link } from "react-router-dom";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  maxVisible?: number;
  searchParams?: URLSearchParams;
}

const Pagination = ({
  currentPage,
  totalPages,
  baseUrl,
  maxVisible = 5,
  searchParams,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const pages: (number | "ellipsis")[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
    endPage = Math.min(totalPages, startPage + maxVisible - 1);
  }

  // Add first page
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push("ellipsis");
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pages.push("ellipsis");
    pages.push(totalPages);
  }

  // Build search params string for links
  const buildHref = (page: number): string => {
    const params = searchParams ? new URLSearchParams(searchParams) : new URLSearchParams();
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      {/* Previous */}
      <Link
        to={buildHref(currentPage - 1)}
        className={`btn-ghost p-2 ${
          currentPage <= 1 ? "opacity-50 pointer-events-none" : ""
        }`}
        aria-label="Previous page"
        aria-disabled={currentPage <= 1}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      {/* Page numbers */}
      <div className="flex items-center gap-1" role="navigation" aria-label="Page numbers">
        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {page === "ellipsis" ? (
              <span className="px-2 text-structural/50">...</span>
            ) : (
              <Link
                to={buildHref(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-gradient-amber text-background"
                    : "bg-background-elevated text-structural hover:bg-background-muted"
                }`}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next */}
      <Link
        to={buildHref(currentPage + 1)}
        className={`btn-ghost p-2 ${
          currentPage >= totalPages ? "opacity-50 pointer-events-none" : ""
        }`}
        aria-label="Next page"
        aria-disabled={currentPage >= totalPages}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </nav>
  );
};

export default Pagination;