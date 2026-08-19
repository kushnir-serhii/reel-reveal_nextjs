import { getMovieTrailerKey } from "@/app/services";
import { MovieInfoTrailerFrame } from "./MovieInfoTrailerFrame";

// Server-rendered trailer: the TMDB response is shared through the Data Cache
// instead of being refetched by every visitor from the browser.
export const MovieInfoTrailerSection = async ({ id }: { id: number }) => {
  const trailerKey = await getMovieTrailerKey(id);

  return <MovieInfoTrailerFrame trailerKey={trailerKey} />;
};
