"use client";

import { createContext, useContext, useMemo } from "react";
import { useSWRConfig } from "swr";
import { useSession } from "next-auth/react";
import { useMovies } from "@/hooks/useMovies";
import {
  addMovieToDBAndMutate,
  removeMovieFromDBAndMutate,
  updateMoviesInDBAndMutate,
} from "@/utils";

interface IMovieInDB {
  movieId: number;
  watched: boolean;
  liked: boolean;
}

interface MoviesContextType {
  likedMovies: number[];
  watchedMovies: number[];
  toggleLiked: (movieId: number) => void;
  toggleWatched: (movieId: number) => void;
  isValidating: boolean;
  isLoading: boolean;
  error: boolean;
}

const ServiceMoviesContext = createContext<MoviesContextType | undefined>(
  undefined
);

export const ServiceMoviesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { mutate } = useSWRConfig();
  const userId = useSession().data?.user?.id ?? "";

  const { data: movies, error, isLoading, isValidating } = useMovies(userId);

  const likedMovies = useMemo(
    () =>
      movies
        ? movies
            .filter((movie: IMovieInDB) => movie.liked)
            .map((movie: IMovieInDB) => movie.movieId)
        : [],
    [movies]
  );

  const watchedMovies = useMemo(
    () =>
      movies
        ? movies
            .filter((movie: IMovieInDB) => movie.watched)
            .map((movie: IMovieInDB) => movie.movieId)
        : [],
    [movies]
  );

  // Service for liked movies
  const toggleLiked = async (movieId: number) => {
    const movie = movies?.find((m: IMovieInDB) => m.movieId === movieId);
    // If movie doesn't exist in DB
    if (!movie) {
      const newMovie = {
        movieId,
        watched: false,
        liked: true,
      };
      addMovieToDBAndMutate(userId, newMovie, mutate);

      // If movie exists in DB update movie
    } else {
      const updatedMovie = {
        movieId,
        liked: !movie.liked,
        watched: movie.watched,
      };
      const updatedMovies = movies.map((m: IMovieInDB) =>
        m.movieId === movieId ? { ...m, liked: !m.liked } : m
      );
      // Update movie in DB if watched true
      if (movie.watched) {
        // console.log("update movie in  liked");
        updateMoviesInDBAndMutate(userId, updatedMovie, updatedMovies, mutate);

        // Remove movie from DB if watched false
      } else {
        // console.log("remove movie from liked");
        removeMovieFromDBAndMutate(userId, movieId, mutate);
      }
    }
  };

  // Service for watched movies
  const toggleWatched = async (movieId: number) => {
    const movie = movies?.find((m: IMovieInDB) => m.movieId === movieId);
    // If movie doesn't exist in DB
    if (!movie) {
      console.log("If movie doesn't exist in DB");
      const newMovie = {
        movieId,
        watched: true,
        liked: false,
      };
      addMovieToDBAndMutate(userId, newMovie, mutate);

      // If movie exists in DB update movie
    } else {
      // console.log("If movie exists in DB update movie");
      const updatedMovie = {
        movieId,
        liked: movie.liked,
        watched: !movie.watched,
      };
      const updatedMovies = movies.map((m: IMovieInDB) =>
        m.movieId === movieId ? { ...m, watched: !m.watched } : m
      );

      // Update movie in DB if liked true
      if (movie.liked) {
        // console.log("Update movie in DB if liked true");
        updateMoviesInDBAndMutate(userId, updatedMovie, updatedMovies, mutate);

        // Remove movie from DB if liked false
      } else {
        // console.log("Remove movie from DB if liked false");
        removeMovieFromDBAndMutate(userId, movieId, mutate);
      }
    }
  };

  return (
    <ServiceMoviesContext.Provider
      value={{
        error,
        likedMovies,
        watchedMovies,
        toggleLiked,
        toggleWatched,
        isValidating,
        isLoading,
      }}
    >
      {children}
    </ServiceMoviesContext.Provider>
  );
};

export const useMoviesContext = () => {
  const context = useContext(ServiceMoviesContext);
  if (!context) {
    throw new Error("useMoviesContext must be used within a MoviesProvider");
  }
  return context;
};
