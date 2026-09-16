
export type DeviceType = "mobile" | "tablet" | "desktop";

export type Actor = {
  adult: boolean;
  cast_id: number;
  name: string;
  character: string;
  original_name: string;
  credit_id: string;
  gender: number;
  id: number;
  known_for_department: string;
  order: number;
  popularity: number;
  profile_path: string;
};

export type FilterArray = (string | number)[]

export type MovieTitleYear = { title: string; year: string };

export type AiChatRole = "user" | "assistant";

// Only what the chat UI needs from a TMDB movie, to keep responses small.
export type AiChatMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

export type AiChatMessage = {
  role: AiChatRole;
  content: string;
  movies?: AiChatMovie[];
  tokens?: number;
};

// TMDB /person/{id}?append_to_response=movie_credits
export type ActorMovieCredit = {
  id: number;
  title: string;
  original_title: string;
  character: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  overview: string;
  adult: boolean;
  video: boolean;
  original_language: string;
};

export type ActorDetails = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  also_known_as: string[];
  gender: number;
  homepage: string | null;
  imdb_id: string | null;
  popularity: number;
  movie_credits?: { cast: ActorMovieCredit[] };
};

export type AiQuota = {
  isGuest: boolean;
  dailyLimit: number;
  dailyUsed: number;
  credits: number;
  remaining: number;
  tokensToday: number;
};

export type AiLimitError = Error & { code?: string };
