import { usePagination } from "@/hooks/usePagination";
import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import type React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { handlePageChange, getVisiblePages } = usePagination(
    currentPage,
    totalPages,
    onPageChange,
  );

  const { visiblePages, showStartEllipsis, showEndEllipsis } =
    getVisiblePages();

  return (
    <HStack gap={2} mt={6} justifyContent="center">
      <IconButton
        aria-label="First page"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        size="sm"
      >
        <FiChevronsLeft />
      </IconButton>
      <IconButton
        aria-label="Previous page"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        size="sm"
      >
        <FiChevronLeft />
      </IconButton>
      {showStartEllipsis && <Text>...</Text>}
      {visiblePages.map((p) => (
        <Button
          key={p}
          onClick={() => handlePageChange(p)}
          variant={p === currentPage ? "solid" : "outline"}
          colorScheme="teal"
          size="sm"
        >
          {p}
        </Button>
      ))}
      {showEndEllipsis && <Text>...</Text>}
      <IconButton
        aria-label="Next page"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        size="sm"
      >
        <FiChevronRight />
      </IconButton>
      <IconButton
        aria-label="Last page"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        size="sm"
      >
        <FiChevronsRight />
      </IconButton>
    </HStack>
  );
};
