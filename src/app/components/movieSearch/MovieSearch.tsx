"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HiOutlineChevronDoubleUp } from "react-icons/hi";
import useSWRInfinite from "swr/infinite";
import { fetchMovieDataFromAPI } from "../../actions/fetchMovieDataFromAPI";
import { IQueryFilterParams, IMovie, ISessionUser } from "@/typification";
import { ListMovies } from "@/app/components/listMovies/ListMovies";
import { MovieSearchFilter } from "./MovieSearchFilter";
import { ButtonOrLink } from "../ui/ButtonOrLink";
import { capitalizeFirstLetter } from "@/utils";
import { useScrollToTop, useShowScrollTopButton } from "@/hooks";
import { Loader } from "../ui/Loader";
import { Modal } from "../ui/Modal";

export interface MovieSearchProps {
  movieTitle?: string | undefined;
  sessionUser: ISessionUser;
}

const SCROLL_STORAGE_PREFIX = "movie-search-scroll:";

export const MovieSearch: React.FC<MovieSearchProps> = ({ sessionUser }) => {
  const [filterOptions, setFilterOptions] = useState<IQueryFilterParams>();

  const isVisible = useShowScrollTopButton(800);
  const { topRef, scrollToTop } = useScrollToTop<HTMLDivElement>();

  const searchParams = useSearchParams();
  const movieTitle = searchParams.get("title") || "";
  const queryGenre = searchParams.get("genre") || null;
  const isActiveSearch = movieTitle.length > 0;

  const currentUrl = isActiveSearch
    ? "/api/movies/one-by-title"
    : `/api/movies/all`;
  const queryKey = isActiveSearch ? movieTitle : JSON.stringify(filterOptions);

  // useSWRInfinite keeps the loaded page count and pages in the global SWR
  // cache, so "load more" progress survives navigating away and back.
  const { data, isLoading, size, setSize } = useSWRInfinite(
    (index) => [currentUrl, queryKey, index + 1],
    ([url, , page]) =>
      fetchMovieDataFromAPI(
        url,
        isActiveSearch
          ? { title: movieTitle, page }
          : { filter: queryKey, page }
      ),
    {
      revalidateOnFocus: false, // Prevents refetching on window focus
      shouldRetryOnError: false, // Prevent retry loops that increase function invocations
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      revalidateIfStale: false, // Only revalidate when explicitly triggered
      revalidateFirstPage: false, // Don't refetch page 1 on every "load more"
    }
  );

  const movies = useMemo(() => {
    const seen = new Set<number>();
    return (data ?? [])
      .flatMap((pageData) => (pageData?.results ?? []) as IMovie[])
      .filter((movie) => !seen.has(movie.id) && seen.add(movie.id));
  }, [data]);
  const totalMovies = data?.[0]?.total_results;
  const lastPage = data?.[data.length - 1];
  const hasMore = !!lastPage && lastPage.page < lastPage.total_pages;
  const isLoadingMore = size > 0 && !!data && data[size - 1] === undefined;

  // Restore the scroll position once the cached pages are rendered again.
  const scrollKey = SCROLL_STORAGE_PREFIX + currentUrl + queryKey;
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current || !data) return;
    restoredRef.current = true;
    try {
      const saved = JSON.parse(sessionStorage.getItem(scrollKey) || "null");
      if (saved && movies.length >= saved.count) {
        requestAnimationFrame(() => window.scrollTo(0, saved.y));
      }
    } catch {}
  }, [data, movies.length, scrollKey]);

  useEffect(() => {
    const save = () => {
      try {
        sessionStorage.setItem(
          scrollKey,
          JSON.stringify({ y: window.scrollY, count: movies.length })
        );
      } catch {}
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [scrollKey, movies.length]);

  const safeQueryTitle = movieTitle
    ? capitalizeFirstLetter(decodeURIComponent(movieTitle))
    : "";

  return (
    <div
      ref={topRef}
      className={`relative flex flex-col items-center justify-center w-full gap-10 lg:gap-12 z-10`}
    >
      {/* &nbsp; */}
      {isActiveSearch && !isLoading ? (
        <h2 className="flex-inline flex-wrap items-start justify-start w-full">
          Found
          <span className="font-bold text-accentColor">
            &nbsp;{totalMovies}&nbsp;
          </span>
          <span className="">{`movies based on your search "${safeQueryTitle}"`}</span>
        </h2>
      ) : (
        <h2 className="flex justify-start items-start w-full">
          The most popular movies
        </h2>
      )}
      {/* Filter */}
      {!movieTitle && (
        <MovieSearchFilter
          getFilterOptions={setFilterOptions}
          genreName={queryGenre}
        />
      )}
      <ListMovies movies={movies} sessionUser={sessionUser} />
      <div
        className={`flex w-full items-center justify-center gap-5 flex-col sm:flex-row`}
      >
        {hasMore && (
          <ButtonOrLink
            onClick={() => setSize(size + 1)}
            transparent
            disabled={isLoadingMore}
            className="md:w-[245px]"
          >
            load more
          </ButtonOrLink>
        )}

        <ButtonOrLink href="/quiz" className="md:w-[245px]">
          take quiz
        </ButtonOrLink>
      </div>
      {/* {isVisible && ( */}
      <button
        onClick={scrollToTop}
        className={`fixed z-30 bottom-28 bg-accentColor/60 hover:bg-accentColor text-bgColor p-2 rounded-full
             transition-all duration-200 easy-in-out ${isVisible ? "right-6" : "-right-[210px]"}`}
      >
        <HiOutlineChevronDoubleUp className="size-10" />
      </button>
      {/* )} */}
      <Modal isOpen={isLoading || isLoadingMore}>
        <Loader />
      </Modal>
    </div>
  );
};
