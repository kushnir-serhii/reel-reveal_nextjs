import { Actor } from "@/typification";

// Credits change very rarely, so cache them for a day.
export const getMovieCast = async (id: number): Promise<Actor[]> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
    {
      next: { revalidate: 86400 },
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN_TMDB}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB credits request failed: ${response.status}`);
  }

  const data = await response.json();

  return (data.cast ?? []) as Actor[];
};
