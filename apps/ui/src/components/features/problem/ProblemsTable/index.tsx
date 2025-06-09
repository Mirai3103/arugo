import { getAllProblemsQueryOptions } from "@/libs/queries/problems";
import { getAllTagsQueryOptions } from "@/libs/queries/tag";
import type { Tag } from "@/server/db/schema";
import { Box, Table, useBreakpointValue } from "@chakra-ui/react";
import { useFilter, useListCollection } from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { PaginationControls } from "../../pagination/PaginationControls";
import { ProblemRow } from "./ProblemRow";
import { generateSkeletonRows } from "./ProblemsTableSkeleton";
import { SearchFilters } from "./SearchFilters";
import { useProblemsSearch } from "./hooks";

const ProblemsTable = () => {
  const { search, debouncedSearch, updateFilters } = useProblemsSearch();
  const [searchTerm, setSearchTerm] = useState(search.search || "");
  const navigate = useNavigate();

  const problemsQuery = useSuspenseQuery(getAllProblemsQueryOptions(search));
  const { data: tags } = useSuspenseQuery(getAllTagsQueryOptions());
  const { contains } = useFilter({ sensitivity: "base" });
  const {
    collection: tagCollection,
    filter,
    set,
  } = useListCollection({
    initialItems: [] as Tag[],
    filter: contains,
    itemToString: (item) => item.name,
    itemToValue: (item) => item.id.toString(),
  });

  useEffect(() => {
    set(tags);
  }, [tags, set]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTerm = e.target.value;
      setSearchTerm(newTerm);
      debouncedSearch(newTerm);
    },
    [debouncedSearch],
  );

  const handleDifficultyChange = useCallback(
    (value: string[]) => {
      updateFilters({ difficultyLevels: value.map(Number) });
    },
    [updateFilters],
  );

  const handleTagsChange = useCallback(
    (value: string[]) => {
      updateFilters({ tags: value.map(Number) });
    },
    [updateFilters],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateFilters({ page: newPage });
    },
    [updateFilters],
  );

  const handleProblemClick = useCallback(
    (slug: string) => {
      navigate({ to: "/problems/$slug", params: { slug } });
    },
    [navigate],
  );

  const { data: problems, pageCount: totalPages } = problemsQuery.data;
  const currentPage = search.page || 1;
  const skeletonRows = React.useMemo(() => generateSkeletonRows(10), []);
  return (
    <Box>
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onDifficultyChange={handleDifficultyChange}
        onTagsChange={handleTagsChange}
        defaultDifficulties={search.difficultyLevels?.map(String) || []}
        tagCollection={tagCollection}
        onTagFilter={filter}
      />

      <Box overflowX="auto">
        <Table.Root
          variant="line"
          size={useBreakpointValue({ base: "sm", md: "md" })}
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Trạng thái</Table.ColumnHeader>
              <Table.ColumnHeader>Tên bài</Table.ColumnHeader>
              <Table.ColumnHeader>Độ khó</Table.ColumnHeader>
              <Table.ColumnHeader>Thẻ</Table.ColumnHeader>
              <Table.ColumnHeader>Tỉ lệ pass</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {problems?.map((problem) => (
              <ProblemRow
                key={problem.id}
                problem={problem}
                onClick={handleProblemClick}
              />
            ))}
            {!problems?.length && (
              <Table.Row>
                <Table.Cell colSpan={5} textAlign="center">
                  No problems found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

export default ProblemsTable;
