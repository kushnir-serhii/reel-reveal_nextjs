// Returns the YouTube key of the first trailer/teaser, or null when there is none.
export const getMovieTrailerKey = async (
  id: number
): Promise<string | null> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
    {
      next: { revalidate: 86400 },
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN_TMDB}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB videos request failed: ${response.status}`);
  }

  const data = await response.json();

  const video = (data.results ?? []).find(
    (item: { type: string; site: string }) =>
      item.site === "YouTube" &&
      (item.type === "Trailer" || item.type === "Teaser")
  );

  return video?.key ?? null;
};
