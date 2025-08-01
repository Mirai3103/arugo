import { useCallback } from "react";

const MAX_VISIBLE_PAGES = 5;

export const usePagination = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void,
) => {
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        onPageChange(newPage);
      }
    },
    [totalPages, onPageChange],
  );

  const getVisiblePages = useCallback(() => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const startPage = Math.max(
      1,
      currentPage - Math.floor(MAX_VISIBLE_PAGES / 2),
    );
    const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);
    const adjustedStartPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);

    return {
      visiblePages: pages.slice(adjustedStartPage - 1, endPage),
      showStartEllipsis: adjustedStartPage > 1,
      showEndEllipsis: endPage < totalPages,
    };
  }, [currentPage, totalPages]);

  return {
    handlePageChange,
    getVisiblePages,
  };
};
