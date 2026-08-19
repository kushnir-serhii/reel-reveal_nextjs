import { getSimilarMoviesByAI } from "@/app/services";
import { GetShowMovies } from "@/app/components/getShowMovies/GetShowMovies";
import { MovieCardSkeleton } from "@/app/components/movieCard/MovieCardSkeleton";
import { ISessionUser } from "@/typification";

export interface SimilarMoviesProps {
  title: string;
  year: string;
  movieId: number;
  sessionUser: ISessionUser;
}

// Server component: the AI suggestions and their TMDB lookups run once per
// movie and are then served from the cache to everybody.
export const SimilarMovies = async ({
  title,
  year,
  movieId,
  sessionUser,
}: SimilarMoviesProps) => {
  if (!title) return null;

  let movies;

  try {
    movies = await getSimilarMoviesByAI(title, year, movieId);
  } catch (error) {
    // Recommendations are a bonus section - if the AI or TMDB is unavailable we
    // hide it rather than failing the whole movie page.
    console.error("Failed to build similar movies:", error);
    return null;
  }

  if (!movies.length) return null;

  return (
    <GetShowMovies
      title={"Similar movies picked by AI"}
      movies={movies}
      sessionUser={sessionUser}
    />
  );
};


export const SimilarMoviesSkeleton: React.FC = () => (
  <section className="flex flex-col items-center gap-12 w-full xl:max-w-[1440px]">
    <h2>Similar movies</h2>
    <div className="max-w-[1200px] w-full">
      <MovieCardSkeleton count={4} />
    </div>
  </section>
);
