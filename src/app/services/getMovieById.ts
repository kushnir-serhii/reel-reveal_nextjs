import { IMovie } from "@/typification";

// Returns null when TMDB has no such movie, throws on any other failure so the
// route can answer with a 404 page / the error boundary instead of blank markup.
export const getMovieById = async (id: number): Promise<IMovie | null> => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    next: { revalidate: 86400 },
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN_TMDB}`,
    },
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(`TMDB movie request failed: ${response.status}`);
  }

  return (await response.json()) as IMovie;
};
