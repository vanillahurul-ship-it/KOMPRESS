import { useMemo, useState } from "react";

// Slices an already-filtered array into pages. Clamps to the last valid page
// during render (not via an effect) whenever the underlying data length
// shrinks — e.g. a new search term narrows the results past the current page.
export default function usePagination(items, pageSize = 10) {
  const [requestedPage, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, totalPages);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return { page, setPage, totalPages, pageItems };
}
