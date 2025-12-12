import { useMemo, useState } from "react";

export default function usePagination(initialPageSize: number = 10) {
  const [pageNumber, setPageNumber] = useState(1);

  const nextPage = () => setPageNumber((prev) => prev + 1);
  const prevPage = () => setPageNumber((prev) => (prev > 1 ? prev - 1 : 1));
  const resetPage = () => setPageNumber(1);

  const query = `PageSize=${initialPageSize}&PageNumber=${pageNumber}`;

  return {
    initialPageSize,
    pageNumber,
    nextPage,
    prevPage,
    resetPage,
    query, // 👉 gives you the query string to attach to API call
  };
}
