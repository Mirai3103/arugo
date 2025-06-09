import { useNavigate, useSearch } from "@tanstack/react-router";
import debounce from "lodash-es/debounce";
import { useCallback } from "react";

const SEARCH_DEBOUNCE_TIME = 500;

export const useProblemsSearch = () => {
  const search = useSearch({ from: "/_home/home" });
  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      navigate({
        to: "/home",
        search: (prev) => ({ ...prev, search: term, page: 1 }),
      });
    }, SEARCH_DEBOUNCE_TIME),
    [],
  );

  const updateFilters = useCallback(
    (updates: Partial<typeof search>) => {
      const isChangePage = Object.keys(updates).some((key) => key === "page");
      navigate({
        to: "/home",
        search: (prev) => ({
          ...prev,
          ...updates,
          page: isChangePage ? updates.page : 1,
        }),
      });
    },
    [navigate],
  );

  return {
    search,
    debouncedSearch,
    updateFilters,
  };
};
