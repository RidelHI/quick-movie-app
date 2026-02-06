import { TmdbConfigurationDto } from '../dto/tmdb-configuration.dto';
import { ImageConfig } from '../../../../shared/models/image-config.model';

export function mapConfigurationDtoToImageConfig(dto: TmdbConfigurationDto): ImageConfig {
  return {
    baseUrl: dto.images.base_url,
    secureBaseUrl: dto.images.secure_base_url,
    backdropSizes: dto.images.backdrop_sizes ?? [],
    logoSizes: dto.images.logo_sizes ?? [],
    posterSizes: dto.images.poster_sizes ?? [],
    profileSizes: dto.images.profile_sizes ?? [],
    stillSizes: dto.images.still_sizes ?? [],
  };
}
