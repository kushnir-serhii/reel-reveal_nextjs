"use client";

import { useContextCountQuiz } from "@/context/CountQuizContext";
import { Icon } from "@/app/components/ui/Icon";
import { quizCountVariants } from "./QuizCount.variants";

interface QuizCountProps {
  className?: string;
}

// Remaining AI requests: "<n> ✨", or a crown when the user is out of them.
export const QuizCount = ({ className }: QuizCountProps) => {
  const { count } = useContextCountQuiz();
  const { base, value, icon } = quizCountVariants();
  const isEmpty = count === 0;

  return (
    <span
      className={base({ className })}
      aria-label={count === null ? undefined : `${count} AI requests left`}
    >
      {!!count && (
        <span aria-hidden className={value()}>
          {count}
        </span>
      )}
      <Icon
        id={isEmpty ? "icon-crown" : "icon-ai"}
        width={20}
        height={18}
        className={icon()}
      />
    </span>
  );
};
