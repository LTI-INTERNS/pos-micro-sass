import { useEffect, useState } from "react";

type Filters = Record<string, string | undefined>;

type UseTableFiltersProps<T> = {
  data: T[];
  searchKeys?: (keyof T)[];
  dateKey?: keyof T;
  search?: string;
  start?: Date;
  end?: Date;
  filters?: Filters;
};

export function useTableFilters<T>({
  data,
  searchKeys = [],
  dateKey,
  search = "",
  start,
  end,
  filters = {},
}: UseTableFiltersProps<T>) {
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    let result = [...data];

    // Search
    if (search.trim() && searchKeys.length) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) =>
          String(item[key]).toLowerCase().includes(q)
        )
      );
    }

    // Date range
    if (start && end && dateKey) {
      result = result.filter((item) => {
        const d = new Date(String(item[dateKey]));
        return d >= start && d <= end;
      });
    }

    // Dropdown filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(
          (item) => String((item as any)[key]) === value
        );
      }
    });

    setFilteredData(result);
  }, [data, search, start, end, filters]);

  return filteredData;
}

export function getFilterOptions<T, K extends keyof T>(
  data: T[],
  key: K
) {
  return Array.from(new Set(data.map((item) => item[key])))
    .filter(Boolean)
    .map((value) => ({
      label: String(value),
      value: String(value),
    }));
}

