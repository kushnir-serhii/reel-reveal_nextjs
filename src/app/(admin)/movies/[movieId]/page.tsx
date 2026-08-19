import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MovieInfo } from "@/app/components/movieInfo/MovieInfo";
import {
  MovieInfoCast,
  MovieInfoCastSkeleton,
} from "@/app/components/movieInfo/MovieInfoCast";
import { MovieInfoTrailerSection } from "@/app/components/movieInfo/MovieInfoTrailerSection";
import { MovieInfoTrailerSkeleton } from "@/app/components/movieInfo/MovieInfoTrailerFrame";
import {
  SimilarMovies,
  SimilarMoviesSkeleton,
} from "@/app/components/similarMovies/SimilarMovies";
import { SliderCarousel } from "@/app/components/sliderCarousel/SliderCarousel";
import { getMovieById } from "@/app/services";
import { getSessionUser } from "@/utils/getSessionUser";

export default async function OneMoviePage({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  const { movieId } = await params;

  // Route params are always strings, so validate before hitting TMDB.
  const id = Number(movieId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [sessionUser, movie] = await Promise.all([
    getSessionUser(),
    getMovieById(id),
  ]);

  if (!movie) notFound();

  const { title, original_title, release_date } = movie;

  const releaseYear = release_date ? String(release_date).slice(0, 4) : "";

  return (
    <div className="flex flex-col items-center overflow-hidden">
      <MovieInfo movie={movie} />
      <div className="page-wrapper">
        <div className="flex items-center justify-center w-full">
          <Suspense fallback={<MovieInfoTrailerSkeleton />}>
            <MovieInfoTrailerSection id={id} />
          </Suspense>
        </div>
        <div className="flex items-center justify-center flex-col w-full gap-16 md:gap-20 xl:gap-30">
          <Suspense fallback={<MovieInfoCastSkeleton />}>
            <MovieInfoCast id={id} />
          </Suspense>
          <Suspense fallback={<SimilarMoviesSkeleton />}>
            <SimilarMovies
              movieId={id}
              title={title ?? original_title}
              year={releaseYear}
              sessionUser={sessionUser}
            />
          </Suspense>
          <SliderCarousel />
        </div>
      </div>
    </div>
  );
}
