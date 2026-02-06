export interface PaginatedResult<T> {
    page: number;
    items: T[];
    totalPages: number;
    totalResults: number;
}
