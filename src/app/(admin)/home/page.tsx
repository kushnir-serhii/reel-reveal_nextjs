import dynamic from "next/dynamic";
import { Hero } from "@/app/components/hero/Hero";
import { HowItWorks } from "@/app/components/howItWorks/HowItWorks";
import { getTopRatedMovies, getUpcomingMovies } from "@/app/services";
import { getSessionUser } from "@/utils/getSessionUser";

const DynamicQuiz = dynamic(() =>
  import("../../components/quiz/Quiz").then((mod) => mod.Quiz)
);
const DynamicSliderCorousel = dynamic(() =>
  import("../../components/sliderCarousel/SliderCarousel").then(
    (mod) => mod.SliderCarousel
  )
);

const DynamicGenres = dynamic(() =>
  import("@/app/components/genres/Genres").then((mod) => mod.Genres)
);

const DynamicGetShowMovies = dynamic(() =>
  import("@/app/components/getShowMovies/GetShowMovies").then(
    (mod) => mod.GetShowMovies
  )
);

export default async function Home() {
  const topRatedMovies = await getTopRatedMovies();
  const upcomingMovies = await getUpcomingMovies();
  const sessionUser = await getSessionUser();

  return (
    <div className="page-wrapper">
      <Hero />
      <HowItWorks />
      <DynamicQuiz sessionUser={sessionUser} />
      <DynamicGetShowMovies
        title={"Upcoming 20 movies in 2025"}
        movies={upcomingMovies}
        sessionUser={sessionUser}
      />

      <DynamicGetShowMovies
        title={"TOP 20 rated movies"}
        movies={topRatedMovies}
        sessionUser={sessionUser}
      />

      <DynamicGenres />
      <DynamicSliderCorousel />
    </div>
  );
}
