import Image from "next/image";
import { ActorDetails } from "@/typification";
import { generateUrlImage } from "@/utils";

interface ActorInfoProps {
  actor: ActorDetails;
  backdropPath: string | null;
}

const getAge = (birthday: string, until: string | null) => {
  const from = new Date(birthday);
  const to = until ? new Date(until) : new Date();
  let age = to.getFullYear() - from.getFullYear();
  const hadBirthday =
    to.getMonth() > from.getMonth() ||
    (to.getMonth() === from.getMonth() && to.getDate() >= from.getDate());
  if (!hadBirthday) age -= 1;
  return age;
};

const getFacts = ({ birthday, deathday, place_of_birth }: ActorDetails) => {
  const facts: { label: string; value: string }[] = [];

  if (birthday) {
    facts.push({
      label: "Birthday",
      value: deathday
        ? birthday
        : `${birthday} (${getAge(birthday, null)} years old)`,
    });
  }
  if (deathday) {
    facts.push({
      label: "Died",
      value: birthday
        ? `${deathday} (aged ${getAge(birthday, deathday)})`
        : deathday,
    });
  }
  if (place_of_birth) {
    facts.push({ label: "Place of Birth", value: place_of_birth });
  }

  return facts;
};

// Hero of the actor page: the backdrop of the actor's best-known film behind
// the portrait, name and key facts.
export const ActorInfo: React.FC<ActorInfoProps> = ({ actor, backdropPath }) => {
  const { name, profile_path } = actor;
  const facts = getFacts(actor);

  return (
    <section className="relative isolate flex justify-center w-full overflow-hidden">
      {backdropPath && (
        <Image
          src={generateUrlImage(backdropPath, "w1280")}
          alt=""
          fill
          // LCP element: preload alone doesn't set fetchpriority.
          preload
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-top -z-10"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bgColor from-10% via-bgColor/70 to-bgColor/30" />

      <div
        className="flex flex-col items-center gap-10 w-full max-w-[1440px] px-4 pt-20
          md:flex-row md:items-end md:px-[60px] md:pt-40 lg:gap-[122px] xl:px-[120px] xl:pt-[280px]"
      >
        <Image
          src={generateUrlImage(profile_path, "w342")}
          alt={`Photo of ${name}`}
          width={285}
          height={428}
          preload={!backdropPath}
          loading={backdropPath ? "eager" : undefined}
          sizes="(min-width: 1024px) 285px, (min-width: 768px) 208px, 285px"
          className="w-[285px] aspect-[285/428] shrink-0 rounded-[18px] object-cover bg-[#20263D] md:w-52 lg:w-[285px]"
        />

        <div className="flex flex-col gap-8 w-full md:gap-[62px]">
          <h1 className="font-bold text-4xl leading-tight md:text-[52px] md:leading-[60px]">
            {name}
          </h1>

          {facts.length > 0 && (
            <dl className="grid grid-cols-[auto_1fr] items-center gap-6 md:gap-x-[92px]">
              {facts.map(({ label, value }) => (
                <div key={label} className="contents">
                  <dt className="justify-self-start rounded-full bg-[#20263D] px-4 py-1 text-lg font-light">
                    {label}
                  </dt>
                  <dd className="text-xl font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
};
