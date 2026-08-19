import { HowItWorks } from "@/app/components/howItWorks/HowItWorks";
import SliderCarousel from "@/app/components/sliderCarousel/SliderCarousel";
import { getSessionUser } from "@/utils/getSessionUser";
import { Quiz } from "../../components/quiz/Quiz";

export default async function Home() {
  const sessionUser = await getSessionUser();

  return (
    <div className="page-wrapper">
      <Quiz sessionUser={sessionUser} isSHowWithAnimation={false} />
      <HowItWorks />
      <SliderCarousel />
    </div>
  );
}
