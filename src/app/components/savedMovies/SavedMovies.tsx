"use client";

import React from "react";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { ButtonOrLink } from "../ui/ButtonOrLink";
import { ListMovies } from "@/app/components/listMovies/ListMovies";
import { Loader } from "../ui/Loader";
import { fetcher } from "../../actions";
import { useMoviesContext } from "@/context/ServiceMoviesContext";
import { IMovie, ISessionUser } from "@/typification";
import { Modal } from "../ui/Modal";

interface SavedMoviesProps {
  sessionUser: ISessionUser;
}

export const SavedMovies: React.FC<SavedMoviesProps> = React.memo(
  ({ sessionUser }) => {
    const { status } = useSession();
    const { likedMovies, isLoading, isValidating } = useMoviesContext();

    const lengthLikedMovies = likedMovies.length;
    const hasLikedMovies = lengthLikedMovies > 0;

    const { data } = useSWR<{ movies: IMovie[] }>(
      hasLikedMovies
        ? ["/api/movies/many-by-array_id", lengthLikedMovies]
        : null,
      () => fetcher(["/api/movies/many-by-array_id", likedMovies]),
      { keepPreviousData: true },
    );

    const movies = hasLikedMovies ? (data?.movies ?? []) : [];

    // Until the session, the liked ids and (if any) the movie details have
    // all resolved, we don't know yet whether the list is empty.
    const isInitialLoading =
      status === "loading" || isLoading || (hasLikedMovies && !data);

    return (
      <div
        className={`flex items-center flex-col justify-center gap-12 w-full mb-20 ${movies.length ? "z-10" : "z-20"} `}
      >
        {isInitialLoading ? null : movies.length === 0 ? (
          <>
            <Image
              src="/images/popcorn.png"
              alt="Popcorn image"
              width={163}
              height={161}
              className="size-auto"
            />
            <p>
              Your list is empty, explore our movie search or take a quiz to
              find something interesting!
            </p>
            <div className="flex flex-col items-center justify-center w-full md:flex-row md:w-[590px] gap-4">
              <ButtonOrLink href="/movies" transparent>
                search movie
              </ButtonOrLink>
              <ButtonOrLink href="/quiz">start quiz</ButtonOrLink>
            </div>
          </>
        ) : (
          <>
            <h1>
              Saved <span className="text-accentColor">{movies.length}</span>{" "}
              movies
            </h1>
            <ListMovies movies={movies} sessionUser={sessionUser} />
          </>
        )}
        <Modal isOpen={isInitialLoading || isValidating}>
          <div className="flex items-center justify-center w-screen h-screen">
            <Loader />
          </div>
        </Modal>
      </div>
    );
  },
);

SavedMovies.displayName = "SavedMovies";
