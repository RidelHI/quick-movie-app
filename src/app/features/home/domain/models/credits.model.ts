export interface CastMember {
  id: number;
  name: string;
  originalName: string;
  knownForDepartment: string;
  character: string;
  profilePath: string | null;
  order: number;
  popularity: number;
  gender: number;
  adult: boolean;
  creditId: string;
  castId: number;
}

export interface CrewMember {
  id: number;
  name: string;
  originalName: string;
  knownForDepartment: string;
  department: string;
  job: string;
  profilePath: string | null;
  popularity: number;
  gender: number;
  adult: boolean;
  creditId: string;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}
