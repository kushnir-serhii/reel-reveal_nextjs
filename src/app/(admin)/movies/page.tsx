import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Genres } from "@/app/components/genres/Genres";
import { Loader } from "@/app/components/ui/Loader";
import { getSessionUser } from "@/utils/getSessionUser";

const MovieSearchDynamics = dynamic(() =>
  import("@/app/components/movieSearch/MovieSearch").then(
    (mod) => mod.MovieSearch
  )
);

export default async function MoviesPage() {

  const sessionUser = await getSessionUser();

  return (
    <div className="page-wrapper">
      <Suspense fallback={<Loader />}>
        <MovieSearchDynamics sessionUser={sessionUser} />
      </Suspense>
      <Genres />
    </div>
  );
}
