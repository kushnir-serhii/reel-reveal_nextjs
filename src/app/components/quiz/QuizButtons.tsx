"use client";

import clsx from "clsx";

interface QuizBtnsProps {
  answers: { answer: string; value: string }[];
  collectQuiz: (answer: string) => void;
  isDisabled: boolean;
}

// Write the pointer position straight to CSS variables (no React state, so no
// re-render per mouse move). The values are kept on leave so the glow fades out
// in place instead of jumping.
const setGlowPosition = (e: React.PointerEvent<HTMLButtonElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - rect.left}px`);
  el.style.setProperty("--y", `${e.clientY - rect.top}px`);
};

export const QuizButtons: React.FC<QuizBtnsProps> = ({
  answers,
  collectQuiz,
  isDisabled,
}) => {
  return (
    <>
      {answers.map((item) => {
        const { answer, value } = item;
        // To prettify text in button to divide strings
        const [firstString, secondString] = answer.split(/\s*(?=\()/);
        const answerForAI = value.length ? value : answer;

        return (
          <button
            key={answer}
            onClick={() => collectQuiz(answerForAI)}
            onPointerEnter={setGlowPosition}
            onPointerMove={setGlowPosition}
            disabled={isDisabled}
            type="button"
            className={clsx(
              "quiz-card relative isolate overflow-hidden flex items-center justify-center w-auto aspect-[285/200] px-2 rounded-xl sm:rounded-[18px] bg-quizBtnGradient border border-transparent",
              "transition duration-300 ease-in-out",
              "focus-visible:outline-none focus-visible:border-accentColor/25 focus-visible:text-accentColor",
              isDisabled
                ? "opacity-50 cursor-default"
                : "hover:border-solid hover:border-accentColor/25 hover:text-accentColor"
            )}
          >
            <span aria-hidden="true" className="quiz-card-glow" />
            <p className="relative z-10 text-xl sm:text-2xl md:text-3xl lg:text-xl">
              {firstString}
              <br />
              {secondString}
            </p>
          </button>
        );
      })}
    </>
  );
};
