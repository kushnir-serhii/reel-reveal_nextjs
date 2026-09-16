"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { Modal } from "../ui/Modal";
import { MovieInfoTrailer } from "../movieInfo/MovieInfoTrailer";
import { MovieCardHover } from "./MovieCardHover";
import { MovieCardSkeleton } from "./MovieCardSkeleton";
import { useHoverPosters } from "./useHoverPosters";
import { IMovie } from "@/typification";
import { useOpenUrl, useResize } from "@/hooks";
import { useMoviesContext } from "@/context/ServiceMoviesContext";

export interface IMovieInDB {
  movieId: number;
  watched: boolean;
  liked: boolean;
}

interface MovieCardProps {
  movie: IMovie;
  // Optional: statically rendered pages don't know the user, so fall back to
  // the client session.
  sessionUserStatus?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  sessionUserStatus: statusFromServer,
}) => {
  const { status } = useSession();
  const sessionUserStatus = statusFromServer ?? status;
  const [isShowHover, setIsShowHover] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openUrl = useOpenUrl();
  const screenWidth = useResize();

  const { likedMovies, watchedMovies, toggleLiked, toggleWatched } =
    useMoviesContext();

  const isLiked = likedMovies.includes(movie.id);
  const isWatched = watchedMovies.includes(movie.id);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const { poster_path, release_date, vote_average, id, title } = movie;

  const { posters, activeIndex } = useHoverPosters(
    id,
    poster_path,
    isShowHover
  );

  const movieForHover = {
    voteAverage: vote_average,
    releaseDate: release_date,
    title: title,
    id: id,
    isLiked: isLiked,
    isWatched: isWatched,
    isShowHover: isShowHover,
  };

const handleMouseEvent = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
  screenWidth > 1024 && setIsShowHover(true);
};

  const handleMovie = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => {
    e.stopPropagation();
    const clickedTarget = e.currentTarget.dataset.movie;

    if (clickedTarget === "movie") {
      
      if (screenWidth < 1024 && !isShowHover) {
         setIsShowHover(true);
      } else if (isShowHover) {
        const url = `/movies/${id}`;
        openUrl(url, e);
      }

      // Open the URL in a new tab if Ctrl or Meta key is pressed
    }

    if (clickedTarget === "trailer") toggleModal();

    if (clickedTarget === "sawIt" || clickedTarget === "saveIt") {
      if (sessionUserStatus !== "authenticated") {
        toast.error("You need to be logged in to save movies");
        return;
      }
      if (clickedTarget === "saveIt") {
        toggleLiked(movie.id);
      }

      if (clickedTarget === "sawIt") {
        toggleWatched(movie.id);
      }
    }
  };

  const poster = `https://image.tmdb.org/t/p/w400${poster_path}`;

  return (
    <div
      onMouseEnter={(e) => {
        handleMouseEvent(e);
      }}
      onMouseLeave={() => {
        setIsShowHover(false);
      }}
      className={"p-1 w-full lg:p-2 xl:p-3"}
    >
      {/* Hover Movie Card */}
      <div className=" relative w-full">
        {/* Extra posters crossfade over the main one while hovered. Rendered
            before the hover overlay so the overlay stays on top. */}
        {posters.slice(1).map((path, i) => (
          <Image
            key={path}
            src={`https://image.tmdb.org/t/p/w400${path}`}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1024px) 285px, (min-width: 769px) 50vw, 80vw"
            className={`object-cover rounded-[18px] transition-opacity duration-700 ease-in-out ${
              activeIndex === i + 1 ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <MovieCardHover movie={movieForHover} handleMovie={handleMovie} />
        {poster_path ? (
          <Image
            id={`${id}`}
            src={poster}
            alt={title}
            width={285}
            height={428}
            // Matches the slider: 4 per row on desktop, 2 on tablet, ~1 on mobile.
            sizes="(min-width: 1024px) 285px, (min-width: 769px) 50vw, 80vw"
            loading="lazy"
            decoding="async"
            className={`w-full h-full rounded-[18px]`}
          />
        ) : (
          <MovieCardSkeleton />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className="flex items-center justify-center p-12 w-full md:w-[70vw]">
          <MovieInfoTrailer id={movie.id} />
        </div>
      </Modal>
    </div>
  );
};
