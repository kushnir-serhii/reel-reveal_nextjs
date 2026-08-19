// Presentational only, so it renders in both the server and the client tree.
interface MovieInfoTrailerFrameProps {
  trailerKey: string | null;
}

export const MovieInfoTrailerFrame: React.FC<MovieInfoTrailerFrameProps> = ({
  trailerKey,
}) => (
  <div className="flex items-center justify-center w-[100vw] md:w-full max-w-[1200px] overflow-hidden">
    {trailerKey ? (
      <div className="flex items-center justify-center overflow-hidden max-w-screen w-full h-auto border-0 rounded-2xl">
        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}`}
          allowFullScreen
          title="Movie trailer"
          loading="lazy"
          className="w-full aspect-video max-w-screen"
        />
      </div>
    ) : (
      <div className="flex items-center justify-center w-full aspect-video rounded-2xl bg-[#20263D]">
        <h3 className="text-white">
          Sorry, we couldn&apos;t find any trailer for this movie
        </h3>
      </div>
    )}
  </div>
);

export const MovieInfoTrailerSkeleton: React.FC = () => (
  <div className="flex items-center justify-center w-[100vw] md:w-full max-w-[1200px] overflow-hidden">
    <div className="w-full aspect-video rounded-2xl bg-[#20263D] animate-pulse" />
  </div>
);
