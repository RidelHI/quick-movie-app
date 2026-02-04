import { TmdbPaginatedResponse } from '../dto/tmdb-paginated-response.dto';
import { TmdbMovieListItemDto } from '../dto/tmdb-movie-list-item.dto';
import { PaginatedResult } from '../models/paginated-result.model';
import { MovieSummary } from '../models/movie-summary.model';
import { mapMovieListItemDtoToSummary } from './movie.mapper';

export function mapPaginatedResponse<TDto, TModel>(
  dto: TmdbPaginatedResponse<TDto>,
  mapItem: (item: TDto) => TModel
): PaginatedResult<TModel> {
  return {
    page: dto.page,
    totalPages: dto.total_pages,
    totalResults: dto.total_results,
    items: (dto.results ?? []).map(mapItem),
  };
}

export function mapMovieListResponseDtoToPaginatedResult(
  dto: TmdbPaginatedResponse<TmdbMovieListItemDto>
): PaginatedResult<MovieSummary> {
  return mapPaginatedResponse(dto, mapMovieListItemDtoToSummary);
}
