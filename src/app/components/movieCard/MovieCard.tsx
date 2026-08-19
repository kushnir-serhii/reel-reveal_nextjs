"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Modal } from "../ui/Modal";
import { MovieInfoTrailer } from "../movieInfo/MovieInfoTrailer";
import { MovieCardHover } from "./MovieCardHover";
import { MovieCardSkeleton } from "./MovieCardSkeleton";
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
  sessionUserStatus: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  sessionUserStatus,
}) => {
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

  const poster = `https://image.tmdb.org/t/p/w400/${poster_path}`;

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
        <MovieCardHover movie={movieForHover} handleMovie={handleMovie} />
        {poster_path ? (
          <Image
            id={`${id}`}
            src={poster}
            alt={title}
            width={285}
            height={428}
            quality={75}
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
