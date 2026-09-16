"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { motion } from "motion/react";
import { Loader } from "../ui/Loader";
import { QuizListMovies } from "./QuizListMovies";
import { QuizQuestions } from "./QuizQuestions";
import { fetchQuizMovies } from "../../actions/fetchQuizMovies";
import { AiLimitError, ISessionUser } from "@/typification";
import { qiuzMoviesSignal } from "@/context/MoviesContext";
import { ButtonOrLink } from "../ui/ButtonOrLink";
import { useContextCountQuiz } from "@/context/CountQuizContext";
import { Modal } from "../ui/Modal";
import { Popup } from "./Popup";
import { animationSection } from "@/variables/animation";
import { AI_LIMIT_CODES } from "@/variables";

const LIMIT_CODES: string[] = [
  AI_LIMIT_CODES.loginRequired,
  AI_LIMIT_CODES.noCredits,
];

const isLimitError = (error: AiLimitError) =>
  !!error?.code && LIMIT_CODES.includes(error.code);

interface IQuizProps {
  sessionUser: ISessionUser;
  isSHowWithAnimation?: boolean;
}

export const Quiz: React.FC<IQuizProps> = ({ sessionUser, isSHowWithAnimation=true, }) => {
  const [quizResult, setQuizResult] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(
    qiuzMoviesSignal.value.length ? false : true
  );

  // Use context count pased quiz
  const { refresh, count, quota } = useContextCountQuiz();

  // Use SWR to fetch quiz movies based on quizResult
  const {
    data: listMovies,
    error,
    isValidating,
    mutate,
  } = useSWR(
    quizResult.length === 8 ? ["quizMovies", quizResult] : null,
    () => fetchQuizMovies(quizResult),
    {
      revalidateOnFocus: false,
      onSuccess: (movies) => {
        if (!movies || !movies.length) throw new Error();
        qiuzMoviesSignal.value = movies ?? [];
        setIsQuizActive(false);
        refresh();
      },
      onError: (error: AiLimitError) => {
        console.error(error);
        refresh();
        if (isLimitError(error)) {
          setQuizResult([]);
          setShowModal(true);
        }
      },
    }
  );

  const handleNextQuizClick = () => {
    if (count !== 0) {
      setQuizResult([]);
      setIsQuizActive(true);
    } else {
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (!showModal) {
      setTimeout(() => {
        setShowPopUp(false);
      }, 300);
    }
    if (showModal) {
      setTimeout(() => {
        setShowPopUp(true);
      }, 300);
    }
  }, [showModal]);

  if (error && !isLimitError(error)) {
    return (
      <div className="flex items-center justify-center flex-col gap-12">
        <h2 className={`pr-2.5 pl-2.5`}>Somthing went wrong</h2>
        <ButtonOrLink onClick={mutate}>try again</ButtonOrLink>
      </div>
    );
  }

  return (
    <motion.section
      {...(isSHowWithAnimation ? animationSection : {})}
      className="flex items-center justify-between flex-col py-32 w-full gap-12"
    >
      <div className="w-lvw h-10 bg-repeat-x bg-contain bg-borderIcon rotate-180"/>
      <div className="w-full">
        {isValidating ? (
          <Loader />
        ) : isQuizActive ? (
          <QuizQuestions
            key={quizResult.length ? "answered" : "new"}
            quizData={setQuizResult}
            isLeftQuiz={count === 0}
          />
        ) : (
          <QuizListMovies
            clearPrevQuiz={handleNextQuizClick}
            sessionUser={sessionUser}
            arrMovies={listMovies ?? qiuzMoviesSignal.value}
          />
        )}
      </div>

      <div className="bottom-0 w-lvw h-10 bg-repeat-x bg-contain z-10 bg-borderIcon"/>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="relative flex items-center justify-center md:h-[620px] w-[100vw] md:w-[90vw] lg:w-[860px] h-lvh">
          <div
            className={`absolute w-full h-full transition-all duration-1000 ease-in-out z-40 ${showPopUp ? "left-1/2 -translate-x-1/2" : "-left-[1280px]"}`}
          >
            <Popup
              isGuest={quota?.isGuest ?? !sessionUser.userId}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      </Modal>
    </motion.section>
  );
};
