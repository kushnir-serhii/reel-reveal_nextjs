import dynamic from "next/dynamic";
import { HowItWorks } from "@/app/components/howItWorks/HowItWorks";
import SliderCarousel from "@/app/components/sliderCarousel/SliderCarousel";
import { getSessionUser } from "@/utils/getSessionUser";

const DynamicQuiz = dynamic(() =>
  import("../../components/quiz/Quiz").then((mod) => mod.Quiz)
);

export default async function Home() {
  const sessionUser = await getSessionUser();

  return (
    <div className="page-wrapper">
      <DynamicQuiz sessionUser={sessionUser} isSHowWithAnimation={false} />
      <HowItWorks />
      <SliderCarousel />
    </div>
  );
}
