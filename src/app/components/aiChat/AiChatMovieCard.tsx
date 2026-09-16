import Image from "next/image";
import Link from "next/link";
import { AiChatMovie } from "@/typification";
import { generateUrlImage } from "@/utils/generateUrlImage";
import { Icon } from "../ui/Icon";

interface AiChatMovieCardProps {
  movie: AiChatMovie;
  onSelect: () => void;
}

export const AiChatMovieCard: React.FC<AiChatMovieCardProps> = ({
  movie,
  onSelect,
}) => {
  const { id, title, overview, poster_path, release_date, vote_average } =
    movie;
  const year = release_date.slice(0, 4);

  return (
    <Link
      href={`/movies/${id}`}
      onClick={onSelect}
      className="flex gap-3 p-2 rounded-xl bg-bgSelect transition duration-200 hover:bg-hoverBgColor hover:shadow-hoverShadow"
    >
      <Image
        src={generateUrlImage(poster_path, "w154")}
        alt={title}
        width={64}
        height={96}
        className="w-16 h-24 shrink-0 rounded-lg object-cover"
      />
      <div className="flex flex-col gap-1 min-w-0">
        <p className="font-semibold leading-tight line-clamp-2">{title}</p>
        <div className="flex items-center gap-2 text-xs text-disabledColor">
          {year && <span>{year}</span>}
          {vote_average > 0 && (
            <span className="flex items-center gap-1">
              <Icon id="icon-star" width={12} height={12} className="w-3 h-3" />
              {vote_average.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-xs text-disabledColor line-clamp-3">{overview}</p>
      </div>
    </Link>
  );
};
