"use client";

import { useMoviesContext } from "@/context/ServiceMoviesContext";
import { Icon } from "../ui/Icon";

interface MovieCardHoverBtnProps {
  iconId: string;
  text: string;
  isChecked?: boolean;
  movieId?: number;
  dataMovie: string;
  onClick?:
    | ((e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void)
    | undefined;
}
export const MovieCardHoverBtn: React.FC<MovieCardHoverBtnProps> = ({
  iconId,
  text,
  movieId,
  isChecked,
  dataMovie,
  onClick,
}): React.JSX.Element => {

  const { likedMovies, watchedMovies, toggleLiked, toggleWatched } =
    useMoviesContext();

  const isLiked = likedMovies.includes(movieId ?? 0);
  const isWatched = watchedMovies.includes(movieId ?? 0);

  //  if (clickedTarget === "sawIt" || clickedTarget === "saveIt") {
  //       if (sessionUserStatus !== "authenticated") {
  //         toast.error("You need to be logged in to save movies");
  //         return;
  //       }
  //       if (clickedTarget === "saveIt") {
  //         toggleLiked(movie.id);
  //       }

  //       if (clickedTarget === "sawIt") {
  //         toggleWatched(movie.id);
  //       }
  //     }

  return (
   
    <button
      type="button"
      data-movie={dataMovie}
      onClick={onClick}
      className={`group relative flex items-center justify-end right-0 w-7 h-7
           border rounded-full overflow-hidden transition-all duration-[350ms] ease-in-out
          hover:w-24 text-transparent
         
        `}
    >
      <span
        className={`absolute z-10 w-full h-full border rounded-full pr-4 border-solid transition-all duration-300  ${
          isChecked
            ? "text-accentColor/0 border-accentColor group-hover:text-accentColor"
            : "text-textColor/0 border-textColor group-hover:text-textColor"
        } `}
      >
        {text}
      </span>
      <span
        className={`absolute z-20 ml-auto w-7 h-7 flex items-center justify-center rounded-full border-solid border transition-all duration-350 ease-in-out
         ${isChecked ? "border-accentColor" : "border-textColor"}
       `}
      >
        <Icon
          id={iconId}
          width={16}
          height={16}
          className={`${isChecked ? "text-accentColor" : "text-textColor"}`}
        />
      </span>
    </button>
  );
};
