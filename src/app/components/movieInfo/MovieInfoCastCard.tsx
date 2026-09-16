import Image from "next/image";
import Link from "next/link";
import { generateUrlImage } from "@/utils";
import { Actor } from "@/typification";

interface MovieInfoCastCardProps {
  movie: Actor;
}
export const MovieInfoCastCard: React.FC<MovieInfoCastCardProps> = ({
  movie,
}) => {
  const { id, profile_path, name, character, original_name } = movie;

  return (
    <Link
      href={`/actors/${id}`}
      draggable={false}
      className={`group flex flex-col p-1 sm:p-3 lg:p-2 xl:p-3 gap-6 outline-none focus:outline-none`}
    >
      <Image
        src={`${generateUrlImage(profile_path, "w200")}`}
        alt={`Foto ${name ?? original_name}`}
        width={183}
        height={183}
        draggable={false}
        // Slider shows 6 / 4 / ~2 cards per row (see MovieInfoCastSlider).
        sizes="(min-width: 1024px) 183px, (min-width: 768px) 25vw, 50vw"
        className={`object-cover w-72 lg:w-[183px] aspect-square rounded-xl transition-opacity group-hover:opacity-80`}
      />
      <ul className={`flex flex-col justify-center gap-2`}>
        <li>
          <p className={`font-medium text-xl leading-9 transition-colors group-hover:text-accentColor`}>
            {name ?? original_name}
          </p>
        </li>
        <li>
          <p>{character}</p>
        </li>
      </ul>
    </Link>
  );
};
