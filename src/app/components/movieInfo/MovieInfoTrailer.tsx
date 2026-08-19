"use client";

import useSWR from "swr";
import { fetchMovieDataFromAPI } from "@/app/actions/fetchMovieDataFromAPI";
import {
  MovieInfoTrailerFrame,
  MovieInfoTrailerSkeleton,
} from "./MovieInfoTrailerFrame";

export interface VideoComponentProps {
  id: number;
}

// Client variant, used inside the MovieCard modal where the trailer is only
// needed after user interaction. Server pages should use MovieInfoTrailerSection.
export const MovieInfoTrailer: React.FC<VideoComponentProps> = ({ id }) => {
  const { data, error, isLoading } = useSWR(
    `trailer-${id}`,
    () => fetchMovieDataFromAPI("/api/movies/trailer_id", { movieId: id }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000, // Dedupe for 1 minute
    }
  );

  if (error) return null;

  if (isLoading) return <MovieInfoTrailerSkeleton />;

  const trailerKey =
    (data?.results ?? []).find(
      (item: { type: string; site: string }) =>
        item.site === "YouTube" &&
        (item.type === "Trailer" || item.type === "Teaser")
    )?.key ?? null;

  return <MovieInfoTrailerFrame trailerKey={trailerKey} />;
};
