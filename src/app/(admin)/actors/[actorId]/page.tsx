import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActorInfo } from "@/app/components/actorInfo/ActorInfo";
import { ActorBiography } from "@/app/components/actorInfo/ActorBiography";
import { GetShowMovies } from "@/app/components/getShowMovies/GetShowMovies";
import { SliderCarousel } from "@/app/components/sliderCarousel/SliderCarousel";
import { getActorById } from "@/app/services";
import { cutingString, generateUrlImage } from "@/utils";
import { ActorDetails, IMovie } from "@/typification";

// ISR: each actor page is rendered on its first visit, then served from the
// cache and refreshed at most once a day - no per-request server work.
export const revalidate = 86400;
export const generateStaticParams = async (): Promise<{ actorId: string }[]> => [];

type ActorPageProps = { params: Promise<{ actorId: string }> };

// Route params are always strings, so validate before hitting TMDB.
const parseId = (actorId: string) => {
  const id = Number(actorId);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Movies with a poster, one entry per film (an actor can have several roles in
// the same movie), most-voted first.
const getStarringMovies = (actor: ActorDetails) => {
  const seen = new Set<number>();
  return (actor.movie_credits?.cast ?? [])
    .filter((movie) => {
      if (!movie.poster_path || seen.has(movie.id)) return false;
      seen.add(movie.id);
      return true;
    })
    .sort((a, b) => b.vote_count - a.vote_count);
};

export async function generateMetadata({
  params,
}: ActorPageProps): Promise<Metadata> {
  const id = parseId((await params).actorId);
  // Same request as the page, so the fetch cache deduplicates it.
  const actor = id ? await getActorById(id) : null;
  if (!actor) return {};

  const description = actor.biography
    ? cutingString(actor.biography.replace(/\s+/g, " "), 155)
    : `Movies starring ${actor.name}.`;

  return {
    title: `${actor.name} | Reel-Reveal`,
    description,
    alternates: { canonical: `/actors/${actor.id}` },
    openGraph: {
      title: actor.name,
      description,
      type: "profile",
      url: `/actors/${actor.id}`,
      images: actor.profile_path
        ? [{ url: generateUrlImage(actor.profile_path, "h632"), alt: actor.name }]
        : undefined,
    },
  };
}

export default async function ActorPage({ params }: ActorPageProps) {
  const id = parseId((await params).actorId);
  if (!id) notFound();

  const actor = await getActorById(id);
  if (!actor) notFound();

  const movies = getStarringMovies(actor);
  const backdropPath =
    movies.find((movie) => movie.backdrop_path)?.backdrop_path ?? null;
  // Only the top 20 are sent to the client; the full filmography stays on the server.
  const starring = movies.slice(0, 20) as unknown as IMovie[];

  return (
    <div className="flex flex-col items-center overflow-hidden">
      <ActorInfo actor={actor} backdropPath={backdropPath} />
      <div className="page-wrapper">
        {actor.biography && <ActorBiography biography={actor.biography} />}
        {starring.length > 0 && (
          <GetShowMovies
            title="Starring at"
            movies={starring}
            titleAlign="start"
          />
        )}
        <SliderCarousel />
      </div>
    </div>
  );
}
