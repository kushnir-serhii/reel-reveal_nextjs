interface MovieCardSkeletonProps {
  /** How many card placeholders to render. `1` renders a single bare card. */
  count?: number;
}

// Card placeholders sized exactly like a poster (285x428) so the layout does
// not jump once the real cards arrive. Extra cards are hidden on narrow
// screens to match how many the grid/slider actually shows.
const visibilityByIndex = [
  "",
  "",
  "hidden md:block",
  "hidden lg:block",
  "hidden xl:block",
];

export const MovieCardSkeleton: React.FC<MovieCardSkeletonProps> = ({
  count = 1,
}) => {
  const card = (
    <div className="w-full aspect-[285/428] rounded-[18px] bg-[#20263D] animate-pulse" />
  );

  if (count === 1) return card;

  return (
    <div className="grid w-full grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={`p-1 w-full lg:p-2 xl:p-3 ${
            visibilityByIndex[index] ?? "hidden xl:block"
          }`}
        >
          {card}
        </div>
      ))}
    </div>
  );
};
