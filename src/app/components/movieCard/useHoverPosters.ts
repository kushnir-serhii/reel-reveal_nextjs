import { useEffect, useState } from "react";

const SLIDE_INTERVAL_MS = 1800;

// Shared across cards so re-hovering (or the same movie in another slider)
// doesn't refetch.
const postersCache = new Map<number, Promise<string[]>>();

const fetchPosters = (movieId: number): Promise<string[]> => {
  let request = postersCache.get(movieId);

  if (!request) {
    request = fetch(`/api/movies/posters?movieId=${movieId}`)
      .then((res) => (res.ok ? res.json() : { posters: [] }))
      .then((data: { posters?: string[] }) => data.posters ?? [])
      .catch(() => {
        // Let a later hover retry
        postersCache.delete(movieId);
        return [];
      });
    postersCache.set(movieId, request);
  }

  return request;
};

// Loads the movie's posters on first hover and cycles through them while the
// card stays hovered. Returns the main poster first, then the extra ones.
export const useHoverPosters = (
  movieId: number,
  mainPoster: string | null,
  isActive: boolean
) => {
  const [posters, setPosters] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isActive || !mainPoster) return;

    let cancelled = false;

    fetchPosters(movieId).then((paths) => {
      if (cancelled) return;
      setPosters([mainPoster, ...paths.filter((p) => p !== mainPoster)]);
    });

    return () => {
      cancelled = true;
    };
  }, [isActive, movieId, mainPoster]);

  useEffect(() => {
    if (!isActive) {
      setActiveIndex(0);
      return;
    }
    if (posters.length < 2) return;

    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % posters.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isActive, posters.length]);

  return { posters, activeIndex };
};
