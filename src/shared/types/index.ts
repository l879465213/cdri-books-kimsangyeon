type ApiResponse<T> = {
  meta?: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents?: T;
};

type QueryParam = {
  key: string;
  value: string;
};

export type { ApiResponse, QueryParam };
