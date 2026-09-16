import Image from "next/image";
import { IMovie } from "@/typification";
import { MovieInfoActions } from "./MovieInfoActions";
import { Icon } from "../ui/Icon";
import { cutingString, floorNumber, generateUrlImage } from "@/utils";
import { DateGenresDurationList } from "./DateGenresDurationList";

interface MovieInfoProps {
  movie: IMovie;
}

// Hero of the movie page: the backdrop fills the full width behind the poster,
// title and details, fading into the page (same pattern as the actor page).
export const MovieInfo: React.FC<MovieInfoProps> = ({ movie }) => {
  if (!movie) return null;

  const title = movie.title ?? movie.original_title;

  return (
    <section className="relative isolate flex justify-center w-full overflow-hidden">
      {movie.backdrop_path && (
        <Image
          src={generateUrlImage(movie.backdrop_path, "w1280")}
          alt=""
          fill
          // The backdrop is the LCP element of the movie page.
          preload
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-top -z-10"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bgColor from-10% via-bgColor/70 to-bgColor/30" />

      <div
        className="flex flex-col items-center gap-10 w-full max-w-[1440px] px-4 pt-20
          md:flex-row md:items-end md:px-[60px] md:pt-40 lg:gap-[122px] xl:px-[120px] xl:pt-[280px]"
      >
        <Image
          src={generateUrlImage(movie.poster_path, "w342")}
          alt={title}
          width={285}
          height={428}
          preload={!movie.backdrop_path}
          loading={movie.backdrop_path ? "eager" : undefined}
          sizes="(min-width: 1024px) 285px, (min-width: 768px) 208px, 285px"
          className="w-[285px] aspect-[285/428] shrink-0 rounded-[18px] object-cover bg-[#20263D] md:w-52 lg:w-[285px]"
        />

        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between xl:gap-9">
            <h1 className="font-bold text-4xl leading-tight md:text-[52px] md:leading-[60px]">
              {cutingString(title ?? "", 35)}
            </h1>
            <div className="flex items-center gap-2 shrink-0 xl:pt-3">
              <Icon
                id="icon-star"
                width={22}
                height={22}
                className="text-accentColor"
              />
              {/* Not a heading: an h3 right after the h1 breaks heading order. */}
              <p className="font-medium text-3xl leading-9 md:text-2xl">
                TMDB {floorNumber(movie.vote_average)}
              </p>
            </div>
          </div>
          <DateGenresDurationList
            listGenres={movie.genres ?? []}
            runtime={movie.runtime}
            reliseDate={movie.release_date}
          />

          <p>{cutingString(movie.overview, 300)}</p>
          <MovieInfoActions movieId={movie.id} />
        </div>
      </div>
    </section>
  );
};
