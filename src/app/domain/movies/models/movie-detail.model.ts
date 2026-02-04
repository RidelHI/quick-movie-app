import { Genre } from './genre.model';
import { MovieBase } from './movie-base.model';

export interface ProductionCompany {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
}

export interface ProductionCountry {
  iso3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso639_1: string;
  name: string;
  englishName: string;
}

export interface MovieDetail extends MovieBase {
  genres: Genre[];
  runtime: number | null;
  tagline: string | null;
  status: string | null;
  homepage: string | null;
  budget: number;
  revenue: number;
  imdbId: string | null;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  spokenLanguages: SpokenLanguage[];
}
