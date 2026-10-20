import { Settings } from "react-slick";
import { useResize } from "@/hooks";
import { ListMovies } from "@/app/components/listMovies/ListMovies";
import { MySlider } from "@/app/components/mySlider/MySlider";
import { IMovie, ISessionUser } from "@/typification";
import { MovieCard } from "../movieCard/MovieCard";
import { Button } from "../ui";
import { QuizCount } from "../quizCount";

export interface QuizListMoviesProps {
  arrMovies: IMovie[];
  clearPrevQuiz: () => void;
  sessionUser: ISessionUser;
}

export const QuizListMovies: React.FC<QuizListMoviesProps> = ({
  arrMovies,
  clearPrevQuiz,
  sessionUser,
}) => {
  const viewWidth = useResize();

  const settings: Settings = {
    pauseOnHover: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    infinite: false,
    arrows: false,
    pauseOnFocus: true,
    initialSlide: 0,
    lazyLoad: "ondemand",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 769,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: "10%",
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={` flex flex-col items-center justify-center w-full gap-12`}>
      <h2 className={`pr-2.5 pl-2.5`}>Have you seen these?</h2>

      {viewWidth > 1024 ? (
        <ListMovies movies={arrMovies} sessionUser={sessionUser} />
      ) : (
        <div className={` max-w-300 w-full flex flex-col h-auto`}>
          <MySlider
            arraySlides={arrMovies}
            SlideComponent={(props) => (
              <MovieCard
                {...props}
                sessionUserStatus={sessionUser.userStatus}
              />
            )}
            settings={settings}
          />
        </div>
      )}
      <Button onClick={clearPrevQuiz} className={`md:w-61.25`}>
        <span className="font-semibold">retake quiz</span>
        <QuizCount />
      </Button>
    </div>
  );
};
