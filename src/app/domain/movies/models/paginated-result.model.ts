export interface PaginatedResult<T> {
  page: number;
  totalPages: number;
  totalResults: number;
  items: T[];
}
