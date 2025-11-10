import type { QueryParam } from "@/shared/types";
import { useCallback } from "react";

export const useReplaceQuery = (
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams, options?: { replace?: boolean }) => void
) => {
  const handleReplaceQuery = useCallback(
    (paramsArray: QueryParam[], replace = true, resetAllQueries = false) => {
      const newParams = resetAllQueries ? new URLSearchParams() : new URLSearchParams(searchParams);
      paramsArray?.forEach(({ key, value }) => {
        if (newParams.has(key)) {
          newParams.delete(key);
        }
        if (Array.isArray(value)) {
          value.forEach((v) => {
            newParams.append(key, v);
          });
        } else {
          newParams.set(key, value);
        }
      });
      setSearchParams(newParams, { replace: replace });
    },
    [searchParams, setSearchParams]
  );

  return { handleReplaceQuery };
};
