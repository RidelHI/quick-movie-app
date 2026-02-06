import { TmdbCreditsDto, TmdbCastDto, TmdbCrewDto } from '../dto/tmdb-credits.dto';
import {
  CastMember,
  CrewMember,
  Credits,
} from '../../../../features/movie-detail/domain/models/credits.model';

export function mapCreditsDtoToMovieCredits(dto: TmdbCreditsDto): Credits {
  return {
    id: dto.id,
    cast: (dto.cast ?? []).map(mapCastMember),
    crew: (dto.crew ?? []).map(mapCrewMember),
  };
}

function mapCastMember(dto: TmdbCastDto): CastMember {
  return {
    id: dto.id,
    name: dto.name,
    originalName: dto.original_name,
    knownForDepartment: dto.known_for_department,
    character: dto.character,
    profilePath: dto.profile_path ?? null,
    order: dto.order,
    popularity: dto.popularity,
    gender: dto.gender,
    adult: dto.adult,
    creditId: dto.credit_id,
    castId: dto.cast_id,
  };
}

function mapCrewMember(dto: TmdbCrewDto): CrewMember {
  return {
    id: dto.id,
    name: dto.name,
    originalName: dto.original_name,
    knownForDepartment: dto.known_for_department,
    department: dto.department,
    job: dto.job,
    profilePath: dto.profile_path ?? null,
    popularity: dto.popularity,
    gender: dto.gender,
    adult: dto.adult,
    creditId: dto.credit_id,
  };
}
