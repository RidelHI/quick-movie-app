import { MovieBase } from '../../../../shared/models/movie-base.model';

export interface MovieSummary extends MovieBase {
  genreIds: number[];
}
