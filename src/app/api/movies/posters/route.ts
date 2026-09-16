import { NextResponse } from "next/server";
import { options } from "../options";

const MAX_POSTERS = 6;

type TmdbImage = { file_path: string; vote_average: number };

// Extra posters for the hover slideshow on movie cards. Only English and
// text-free posters, so the card doesn't flip between languages.
export const GET = async (req: Request): Promise<NextResponse> => {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");

  if (!movieId || !/^\d+$/.test(movieId)) {
    return NextResponse.json({ error: "Invalid movieId" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/images?include_image_language=en,null`,
      options
    );

    if (!response.ok) {
      throw new Error(`TMDB images request failed: ${response.status}`);
    }

    const data: { posters?: TmdbImage[] } = await response.json();

    const posters = (data.posters ?? [])
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, MAX_POSTERS)
      .map((poster) => poster.file_path);

    // Posters rarely change
    return NextResponse.json(
      { posters },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=172800",
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching movie posters:", error?.message);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
