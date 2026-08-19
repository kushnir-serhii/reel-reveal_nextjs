import { getMovieCast } from "@/app/services";
import { MovieInfoCastSlider } from "./MovieInfoCastSlider";

// Server component: the credits come from the shared Data Cache, only the
// carousel itself is shipped to the browser.
export const MovieInfoCast = async ({ id }: { id: number }) => {
  const cast = await getMovieCast(id);

  if (!cast.length) return null;

  return (
    <div className="flex flex-col justify-center items-center w-full mt-16 md:mt-20 xl:mt-30">
      <h2 className="flex justify-start md:justify-center w-full mb-12">
        Top cast
      </h2>
      <MovieInfoCastSlider cast={cast} />
    </div>
  );
};

export const MovieInfoCastSkeleton: React.FC = () => (
  <div className="flex flex-col justify-center items-center w-full mt-16 md:mt-20 xl:mt-30">
    <h2 className="flex justify-start md:justify-center w-full mb-12">
      Top cast
    </h2>
    <div className="container h-[220px] rounded-2xl bg-[#20263D] animate-pulse" />
  </div>
);
