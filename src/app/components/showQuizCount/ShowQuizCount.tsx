"use client";

import { useContextCountQuiz } from "@/context/CountQuizContext";
import { Icon } from "../ui/Icon";

export const ShowQuizCount: React.FC = () => {
  const { count } = useContextCountQuiz();

  return (
    <span className="flex items-center gap-[3px]">
      {!!count && <span className="font-semibold text-base">{count}</span>}
      <Icon id={count === 0 ? "icon-crown" : "icon-ai"} width={20} height={18} className="text-bgColor" />
    </span>
  );
};
