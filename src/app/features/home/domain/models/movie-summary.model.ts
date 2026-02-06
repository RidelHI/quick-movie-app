import { MovieBase } from './movie-base.model';

export interface MovieSummary extends MovieBase {
  genreIds: number[];
}
