import { IMovie, MovieTitleYear } from "@/typification";

// Searches TMDB for each { title, year } pair and returns one result list per
// pair (same order as the input).
export const getManyMoviesByTitle = async (
  arrMovies: MovieTitleYear[]
): Promise<IMovie[][]> => {
  const token = process.env.BEARER_TOKEN_TMDB;

  const requests = arrMovies.map(async ({ title, year }) => {
    const params = new URLSearchParams({ query: title, language: "en-US" });
    if (year) params.set("year", year);

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?${params}`,
      {
        next: { revalidate: 86400 },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // A single failed lookup must not sink the whole batch.
    if (!response.ok) {
      console.error(`TMDB search failed for "${title}": ${response.status}`);
      return [] as IMovie[];
    }

    const data = await response.json();

    return (data.results ?? []) as IMovie[];
  });

  return Promise.all(requests);
};
