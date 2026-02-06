import { Genre } from '../../../../shared/models/genre.model';
import { MovieBase } from '../../../../shared/models/movie-base.model';

import {
  TmdbGenreDto,
  TmdbMovieDetailDto,
  TmdbProductionCompanyDto,
  TmdbProductionCountryDto,
  TmdbSpokenLanguageDto,
} from '../dto/tmdb-movie-detail.dto';
import {
  MovieDetail,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
} from '../models/movie-detail.model';

export function mapMovieDetailDtoToDetail(dto: TmdbMovieDetailDto): MovieDetail {
  return {
    ...mapMovieBaseFromDetail(dto),
    genres: (dto.genres ?? []).map(mapGenreDtoToGenre),
    runtime: dto.runtime ?? null,
    tagline: normalizeStringOrNull(dto.tagline),
    status: normalizeStringOrNull(dto.status),
    homepage: normalizeStringOrNull(dto.homepage),
    budget: dto.budget,
    revenue: dto.revenue,
    imdbId: normalizeStringOrNull(dto.imdb_id),
    productionCompanies: (dto.production_companies ?? []).map(mapProductionCompanyDto),
    productionCountries: (dto.production_countries ?? []).map(mapProductionCountryDto),
    spokenLanguages: (dto.spoken_languages ?? []).map(mapSpokenLanguageDto),
  };
}

export function mapGenreDtoToGenre(dto: TmdbGenreDto): Genre {
  return {
    id: dto.id,
    name: dto.name,
  };
}

function mapMovieBaseFromDetail(dto: TmdbMovieDetailDto): MovieBase {
  return {
    id: dto.id,
    title: dto.title,
    originalTitle: dto.original_title,
    overview: dto.overview ?? '',
    posterPath: dto.poster_path ?? null,
    backdropPath: dto.backdrop_path ?? null,
    releaseDate: normalizeDateOrNull(dto.release_date),
    originalLanguage: dto.original_language,
    adult: dto.adult,
    popularity: dto.popularity,
    voteAverage: dto.vote_average,
    voteCount: dto.vote_count,
  };
}

function mapProductionCompanyDto(dto: TmdbProductionCompanyDto): ProductionCompany {
  return {
    id: dto.id,
    name: dto.name,
    logoPath: dto.logo_path ?? null,
    originCountry: dto.origin_country,
  };
}

function mapProductionCountryDto(dto: TmdbProductionCountryDto): ProductionCountry {
  return {
    iso3166_1: dto.iso_3166_1,
    name: dto.name,
  };
}

function mapSpokenLanguageDto(dto: TmdbSpokenLanguageDto): SpokenLanguage {
  return {
    iso639_1: dto.iso_639_1,
    name: dto.name,
    englishName: dto.english_name,
  };
}

function normalizeDateOrNull(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeStringOrNull(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
