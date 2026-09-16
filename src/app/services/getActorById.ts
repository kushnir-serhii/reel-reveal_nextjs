import { ActorDetails } from "@/typification";

// Person data and filmography change rarely, so cache them for a day.
// Returns null when TMDB has no such person, throws on any other failure.
export const getActorById = async (id: number): Promise<ActorDetails | null> => {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}?append_to_response=movie_credits&language=en-US`,
    {
      next: { revalidate: 86400 },
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN_TMDB}`,
      },
    }
  );

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(`TMDB person request failed: ${response.status}`);
  }

  return (await response.json()) as ActorDetails;
};
