import { Suspense } from "react";
import type { Metadata } from "next";
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
import { cutingString, generateUrlImage } from "@/utils";

// ISR: each movie page is rendered on its first visit, then served from the
// cache and refreshed at most once a day (keep the fetches' revalidate >= this,
// the lowest value wins).
export const revalidate = 86400;
export const generateStaticParams = async (): Promise<{ movieId: string }[]> => [];

type MoviePageProps = { params: Promise<{ movieId: string }> };

// Route params are always strings, so validate before hitting TMDB.
const parseId = (movieId: string) => {
  const id = Number(movieId);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const id = parseId((await params).movieId);
  // Same request as the page, so the fetch cache deduplicates it.
  const movie = id ? await getMovieById(id) : null;
  if (!movie) return {};

  const title = movie.title ?? movie.original_title;
  const description = movie.overview
    ? cutingString(movie.overview.replace(/\s+/g, " "), 155)
    : `Watch the trailer, cast and similar movies to ${title}.`;

  return {
    title: `${title} | Reel-Reveal`,
    description,
    alternates: { canonical: `/movies/${movie.id}` },
    openGraph: {
      title,
      description,
      type: "video.movie",
      url: `/movies/${movie.id}`,
      images: movie.backdrop_path
        ? [{ url: generateUrlImage(movie.backdrop_path, "w1280"), alt: title }]
        : undefined,
    },
  };
}

export default async function OneMoviePage({ params }: MoviePageProps) {
  const id = parseId((await params).movieId);
  if (!id) notFound();

  const movie = await getMovieById(id);

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
            />
          </Suspense>
          <SliderCarousel />
        </div>
      </div>
    </div>
  );
}
