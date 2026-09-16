"use client";

import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Icon } from "../ui/Icon";
import { useMoviesContext } from "@/context/ServiceMoviesContext";

interface MovieInfoActionsProps {
  movieId: number;
}

interface ActionButtonProps {
  isActive: boolean;
  iconId: string;
  label: string;
  activeLabel: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  isActive,
  iconId,
  label,
  activeLabel,
  onClick,
}) => (
  <button
    type="button"
    aria-pressed={isActive}
    onClick={onClick}
    className={`flex items-center justify-center gap-2 h-11 min-w-[140px] px-5 rounded-full border
      font-semibold text-base backdrop-blur-md transition-all duration-300 ease-in-out
      focus-visible:outline-none focus-visible:shadow-focusShadow active:scale-95
      bg-white/5 border-white/30 text-textColor hover:border-accentColor hover:text-accentColor hover:bg-hoverBgColor`}
  >
    <Icon
      id={iconId}
      width={18}
      height={18}
      className={`shrink-0 ${isActive ? "text-accentColor" : ""}`}
    />
    <span>{isActive ? activeLabel : label}</span>
  </button>
);

// Client island for the movie page: MovieInfo stays a server component, only
// the save / watched toggles need the session and the saved-movies context.
export const MovieInfoActions: React.FC<MovieInfoActionsProps> = ({
  movieId,
}) => {
  const { status } = useSession();
  const { likedMovies, watchedMovies, toggleLiked, toggleWatched } =
    useMoviesContext();

  const isLiked = likedMovies.includes(movieId);
  const isWatched = watchedMovies.includes(movieId);

  const withAuth = (action: (id: number) => void) => () => {
    if (status !== "authenticated") {
      toast.error("You need to be logged in to save movies");
      return;
    }
    action(movieId);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ActionButton
        isActive={isLiked}
        iconId={isLiked ? "icon-heart_fill" : "icon-heart"}
        label="Save"
        activeLabel="Saved"
        onClick={withAuth(toggleLiked)}
      />
      <ActionButton
        isActive={isWatched}
        iconId="icon-checked"
        label="Mark as watched"
        activeLabel="Watched"
        onClick={withAuth(toggleWatched)}
      />
    </div>
  );
};
