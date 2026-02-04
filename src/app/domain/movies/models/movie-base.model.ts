export interface MovieBase {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  originalLanguage: string;
  adult: boolean;
  popularity: number;
  voteAverage: number;
  voteCount: number;
}
